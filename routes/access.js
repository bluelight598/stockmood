var logManager = require('../dal/logger'),
	log = logManager.getLogger('webService'),
	co = require('co'),
	thunkify = require('thunkify'),
	redis = require("redis"),
	CONFIG = require('../config/settings'),
	client = redis.createClient(CONFIG.redisClient),
	accessRuleConfig = require('./accessRule');
var PLATFORMID = CONFIG.platformId;
client.set = thunkify(client.set);
client.get = thunkify(client.get);
client.del = thunkify(client.del);

module.exports = function(req, res, next) {
	var self = this;
	this.url = req.url; //req.path;
	this.access = false; // 是否有权限

	var userName = req.session && req.session.accessToken && req.session.accessToken.userInfo && req.session.accessToken.userInfo.name || '未登录';
	// log.debug('用户[' + userName + '],当前访问path=' + this.url)

	var checkApiUrl = function(redirectUrl) { // 检测当前url是否属于api类别，如果是api则不重定向到403页
		var reg = /^\/api\//;
		log.info('用户[' + userName + '],当前访问path=' + self.url);
		if (reg.test(self.url)) { // 是api服务，则返回jsonp
			res.jsonp({
				code: 403,
				success: false,
				message: '权限不足'
			})
		} else { // 是页面请求，则重定向去登录
			res.redirect(redirectUrl);
		}
	};

	var checkFreeList = function() { // 检测免登陆路由（不用登录即可访问）
		var freeRules = accessRuleConfig.route.free;
		for (var i = 0; i < freeRules.length; i++) {
			if (freeRules[i].test(self.url)) {
				// console.log('命中：免登陆路由->' + freeRules[i])
				self.access = true;
				return false;
			}
		}
	};

	var checkAllowList = function() { // 检测登录白名单路由（登录即可访问）
		var allowRules = accessRuleConfig.route.allow;
		for (var i = 0; i < allowRules.length; i++) {
			if (allowRules[i].test(self.url)) {
				// log.debug('命中：登录白名单路由->' + allowRules[i])
				self.access = true;
				return false;
			}
		}
	};

	var checkAdminPower = function(accessRight) { // 超级管理员权限验证
		if (accessRight['0'] != undefined) {
			return true;
		} else {
			return false;
		}
	};

	var getUrlAppId = function() { // 反查访问当前URL所需要的权限ID
		var appRules = accessRuleConfig.route.app;
		var accessNeed = [];

		function hasVisitRight(appRule) {
			var hasPower = false;
			for (var i = 0; i < appRule.length; i++) {
				if (appRule[i].test(self.url)) {
					log.debug(self.url + '命中：url app路由->' + appRule[i]);
					hasPower = true;
					return hasPower;
				} else {
					// log.debug(self.url + '未命中：url app路由->' + appRule[i]);
				}
			}
			return hasPower;
		}
		// 超级管理员0  经理-4 主管-3 组长-2 员工-1
		for (var appId in appRules) {
			/*if (hasVisitRight(appRules[appId].rules.guest)) { // 遍历当前app下guest路由
				// 找到当前url所对应路由规则的appId
				log.debug('找到当前url所对应[guest路由]规则的appId:' + appId);
				accessNeed.push({
					appId: appId,
					power: 1
				});
			}
			if (hasVisitRight(appRules[appId].rules.master)) { // 遍历当前app下master路由
				// 找到当前url所对应路由规则的appId
				log.debug('找到当前url所对应[master]路由规则的appId:' + appId);
				accessNeed.push({
					appId: appId,
					power: 2
				});
			}*/
			for (var power in appRules[appId].rules) {
				if (hasVisitRight(appRules[appId].rules[power])) { // 遍历当前app下guest路由
					// 找到当前url所对应路由规则的appId
					log.debug('找到当前url所对应[guest路由]规则的appId:' + appId);
					accessNeed.push({
						appId: appId,
						power: power
					});
				}
			}
		}
		// log.debug('当前访问的url没有匹配到任何可用的规则。appId=' + appId);
		return accessNeed;
	};

	var checkAppList = function(accessRight) { // 检测登录白名单路由
		var appRules = accessRuleConfig.route.app;

		if (checkAdminPower(accessRight)) { // 命中：超级管理员
			log.debug('命中：超级管理员')
			self.access = true;
			return false;
		}
		// log.debug('非超管')
		var appAccessInfo = getUrlAppId(); // 反查可以访问当前URL的权限ID及power

		if (appAccessInfo.length <= 0) { // 无法匹配到当前url的路由规则记录
			log.debug('当前访问的url=' + self.url + '不在路由规则中');
		} else {
			for (var i = 0; i < appAccessInfo.length; i++) { // 确保遍历到全部appId的路由权限规则，以便实现url权限多对多访问
				var tmpAccess = appAccessInfo[i];
				var appId = tmpAccess.appId;
				if (accessRight[tmpAccess.appId] >= tmpAccess.power) { // 用户拥有权限>=页面需要权限
					// 当前url存在于这个应用权限列表，并且当前用户的
					self.access = true;
					log.debug('当前用户拥有所访问的页面的权限！');
				} else {
					// 当前url规则存在于这个应用权限列表中，但是该用户并没有这个应用的相应权限
				}
			}
		}

	};

	// 检测免登陆路由
	checkFreeList();
	if (self.access) {
		return next();
	}
	// 检测是否登录
	if (!req.session || !req.session.accessToken) { // 未登录
		log.debug('未登录，跳转登录页,存储当前url：' + self.url);
		if (typeof req.session == 'object') {
			req.session.url = self.url;
		}
		return checkApiUrl('/system/login/-2');
	} else { // 已登录
		checkAllowList(); // 检测登录白名单(登录即可访问)
		if (self.access) {
			return next();
		}
		log.debug('已登录,获取个人token信息');
		var userId = req.session.accessToken.userInfo.id;
		console.log(req.session)
		co(function*() { // 获取用户权限信息，验证app路由名单
			var token = yield client.get('userId:' + userId); // 根据uid，从redis中获取用户token
			if (token) {
				var userAccess = yield client.get(token); // 根据token，从redis中获取用户身份信息
				if (userAccess) {
					try {
						userAccess = JSON.parse(userAccess);
					} catch (e) {
						log.error(JSON.stringify({ // todo handle
							type: 'whitelist',
							status: 'failure',
							msg: 'Redis-userAccess解析失败',
							userAccess: userAccess,
							error: e
						}));
					}
					// 解析用户身份成功，验证用户权限
					var accessRight = userAccess.accessToken.accessRight; // TODO 用户中心更新后启用下面的方法。用户当前持有的权限
					// var accessRight = userAccess.accessToken.accessRight[PLATFORMID]; // 用户当前持有的权限
					checkAppList(accessRight); // 检测
					if (self.access) {
						log.debug('权限通过')
						return next();
					} else {
						log.debug('权限不足，无法访问：' + self.url);
						return checkApiUrl('/system/error/403');
					}
				} else {
					log.debug('找不到userAccess,存储当前url：' + self.url);
					if (typeof req.session == 'object') {
						req.session.url = self.url;
					}
					return checkApiUrl('/system/login/-2');
				}

			} else { // 没有查询到token
				log.debug('找不到用户token,存储当前url：' + self.url);
				if (typeof req.session == 'object') {
					req.session.url = self.url;
				}
				return checkApiUrl('/system/login/-2');
			}
		});

	}

};