'use strict';

var viewpath = './system/';
var logManager = require('../../dal/logger');
var log = logManager.getLogger('webService');

var CONFIG = require('../../config/settings');
var userCenter = require('./userCenter');
var co = require('co');
var thunkify = require('thunkify');
var redis = require("redis");
var crypto = require('crypto');
var request = require('request');
var client = redis.createClient(CONFIG.redisClient);
var accessRule = require('../../routes/accessRule');
var PLATFORMID = CONFIG.platformId;
// var APPID_MAP = require('../powerManager/Config');

client.set = thunkify(client.set);
client.get = thunkify(client.get);
client.del = thunkify(client.del);

var kickOffUser = function*(userId) { // 清除指定用户的session信息，踢该用户下线
	var sessionId = yield client.get('userId:' + userId);
	if (sessionId) { // 存在失效用户session，则删除旧记录
		yield client.del(sessionId);
	} else { // 没找到匹配的sessionID
		// console.log('没找到匹配的sessionID');
	}
};

var getPassword = function(passwd) { // java服务端用户密码加密算法，与客户端加密统一（暂时不用，因为已在前端js中执行加密）
	var pas256 = crypto.createHash('sha256').update(passwd, 'utf8').digest('hex');
	var md5 = crypto.createHash('md5').update(passwd).digest('hex').toUpperCase();
	var newPassHash = md5.slice(0, 8) +
		pas256.slice(24, 32) +
		pas256.slice(0, 8) +
		md5.slice(16, 24) +
		md5.slice(8, 16) +
		pas256.slice(8, 16) +
		pas256.slice(16, 24) +
		md5.slice(24, 32);
	newPassHash = crypto.createHash('sha256').update(newPassHash, 'utf8').digest('hex');
	return newPassHash.slice(0, 32);
};

// var powerTransformer = function(accessRight, uid) { // 翻译用户权限-getAuthsDo、getAllUsers接口使用
// 	var appMap = APPID_MAP.app[accessRight.platform].appId;
// 	var columnArr = [];
// 	var obj = {}
// 	for (var appId in appMap) {
// 		columnArr.push({
// 			appId: appId,
// 			appName: appMap[appId]
// 		})
// 		obj.authMap = accessRight.auths || {};
// 		obj.platform = accessRight.platform;
// 		obj.column = columnArr;
// 		obj.roleId = uid || '';
// 	}
// 	return obj
// };

// 系统 路由handler

var systemController = {
	init: function(app) {
		app.get('/', this.home); // 首页
		app.get(['/system/login',
			'/system/login/:status'
		], this.login); // 登录
		app.get(['/system/error', '/system/error/:status'], this.errorPage); // 出错页
		app.get('/api/system/logout.do', this.logoutDo); // 登出
		app.post('/api/system/register.do', this.registerDo); // 注册新账号
		app.post('/api/system/forget.do', this.forgetDo); // 注册新账号
		app.post('/api/system/login.do', this.loginDo); // 注册新账号	
		app.post('/api/system/sendEmail.do', this.sendEmailDo); // 发送验证邮件（注册1，找回密码2）
	},
	login: function(req, res, next) { // 登录
		res.render(viewpath + 'login/index', {
			title: '登录'
		});
	},

	registerDo: function(req, res, next) { // 调用注册接口
		// res.redirect('/system/login/2');
		var unionId = req.body.unionId;
		var password = req.body.password;
		var captcha = req.body.captcha;
		request.post({ // 注册用户
			url: userCenter.register.url,
			form: {
				captcha: captcha,
				unionId: unionId,
				password: password
			}
		}, function(err, httpResponse, body) {
			if (err) {
				log.error(JSON.stringify({
					type: 'register.do',
					status: 'failure',
					msg: 'requestError,请求异常',
					unionId: unionId,
					captcha: captcha,
					error: err
				}));
				res.redirect('/system/login/-3');
			} else {
				var result = null;
				try {
					result = JSON.parse(body);
				} catch (e) {
					log.error(JSON.stringify({
						type: 'register.do',
						status: 'failure',
						msg: 'parseBodyError,返回参数解析失败',
						unionId: unionId,
						captcha: captcha,
						parseBody: body,
						error: e
					}));
					log.error(body);
					result = {
						code: 'parseErr',
					}
				}
				if (result.code == 0) {
					log.info(JSON.stringify({
						type: 'register.do',
						status: 'success',
						msg: '注册成功',
						unionId: unionId,
						captcha: captcha,
						uid: result.uid,
						result: result,
						error: false
					}));
					req.session.accessToken = {
						accessToken: result.accessToken,
						name: unionId,
						uid: result.uid
					};
					// MSG.success = true;
				} else {
					// MSG.msg = '其他错误';
					log.error(JSON.stringify({
						type: 'register.do',
						status: 'failure',
						msg: '注册失败',
						unionId: unionId,
						captcha: captcha,
						result: result,
						error: false
					}));
				}
				res.redirect('/system/login/' + result.code);
				// res.jsonp(MSG)
			}
		});
	},

	forgetDo: function(req, res, next) { // 忘记密码接口
		// res.redirect('/system/login/1');
		var unionId = req.body.unionId;
		var password = req.body.password;
		var captcha = req.body.captcha;
		request.post({
			url: userCenter.forget.url,
			form: {
				unionId: unionId,
				password: password,
				captcha: captcha
			}
		}, function(err, httpResponse, body) {
			if (err) {
				log.error(JSON.stringify({
					type: 'forgetDo.do',
					status: 'failure',
					msg: 'requestError,请求异常',
					unionId: unionId,
					captcha: captcha,
					error: err
				}));
				res.redirect('/system/login/-3');
			} else {
				var result = null;
				try {
					result = JSON.parse(body);
				} catch (e) {
					log.error(JSON.stringify({
						type: 'forgetDo.do',
						status: 'failure',
						msg: 'parseBodyError,返回参数解析失败',
						unionId: unionId,
						captcha: captcha,
						parseBody: body,
						error: e
					}));
					log.error(body);
					result = {
						code: 'parseErr',
					}
				}
				if (result.code == 0) {
					log.info(JSON.stringify({
						type: 'forgetDo.do',
						status: 'success',
						msg: '密码重置成功',
						unionId: unionId,
						captcha: captcha,
						uid: result.uid,
						result: result,
						error: false
					}));
					req.session.accessToken = {
						accessToken: result.accessToken,
						name: unionId,
						uid: result.uid
					};
				} else {
					log.error(JSON.stringify({
						type: 'forgetDo.do',
						status: 'failure',
						msg: '密码重置失败',
						unionId: unionId,
						captcha: captcha,
						error: result
					}));
				}
				res.redirect('/system/login/' + result.code);
				// res.jsonp(MSG)
			}
		});
	},

	logoutDo: function(req, res, next) { // 登出
		var username = null;
		if (req.session && typeof req.session.accessToken != 'undefined' && req.session.accessToken.name) {
			username = req.session.accessToken.name;
			req.session.destroy(function(err) {
				if (!err) {
					log.info(JSON.stringify({
						type: 'logout.do',
						status: 'success',
						msg: '用户[' + username + ']登出成功',
						error: false
					}));
					res.redirect('/system/login');
				} else {
					log.error(JSON.stringify({
						type: 'logout.do',
						status: 'failure',
						msg: '用户[' + username + ']登出失败',
						error: err
					}));
					res.redirect('/system/login');
				}
			});
		} else {
			res.redirect('/system/login');
		}
	},

	loginDo: function(req, res, next) { // 接入用户中心的登录接口

		var username = req.body.username;
		var password = req.body.password;

		var t = new Date().getTime();

		log.debug({
			url: userCenter.login.url,
			form: {
				platform: PLATFORMID,
				deviceId: 'ZXCZXCAd',
				osType: 0,
				unionId: username,
				password: password
			}
		});
		// 从用户中心后台获取到真实的userId后，执行session持久化存储

		try {

		request.post({
			url: userCenter.login.url,
			form: {
				platform: PLATFORMID,
				deviceId: 'ZXCZXCAd',
				osType: 0,
				unionId: username,
				password: password
			}
		}, function(err, httpResponse, body) {
			var endTime = new Date().getTime();
			var duringTime = (endTime - t)/1000;
			log.debug(`用户 [${username}] 登录接口调用结束，耗时： ${duringTime}秒。`);
			if (err) {
				log.error(JSON.stringify({
					type: 'login.do',
					status: 'failure',
					msg: '登录请求失败',
					error: err
				}));
				res.redirect('/system/login/-1');
			} else {
				var result = null;
				try {
					result = JSON.parse(body);
				} catch (e) {
					log.error(JSON.stringify({
						type: 'login.do',
						status: 'failure',
						msg: '返回参数解析失败',
						body: body,
						error: e
					}));
					result = {
						code: -3,
					}
				}
				if (result.code == 0) {
					var userId = result.uid;
					co(function*() { // 用户名、密码验证成功，写入session
						yield kickOffUser(userId); // 尝试删除用户的过期session记录;
						var setUidResult = yield client.set('userId:' + userId, req.sessionID);
						req.session.accessToken = {
							accessToken: (new Date().getTime()),
							name: username,
							uid: userId,
							accessRight: result.authMap // 权限
						};
						log.info(req.session.accessToken);
						var gotoUrl = req.session.url ? req.session.url : '/';
						if (gotoUrl == '/favicon.ico') {
							gotoUrl = '/';
						}
						req.session.url = null;
						log.info(JSON.stringify({
							type: 'login.do',
							status: 'success',
							msg: '用户[' + username + ']登录成功',
							error: false
						}));
						res.redirect(gotoUrl);
					});
				} else {
					log.warn(JSON.stringify({
						type: 'login.do',
						status: 'failure',
						msg: '登录异常',
						code: result.code,
						error: result
					}));
					res.redirect('/system/login/' + result.code);
				}

			}
		});

		}catch(eee) {
			log.error(eee);
		}

		log.debug('[登录]请求已发送');


		// TODO 本地测试用
		/*co(function*() {
			var setUidResult = yield client.set('userId:' + 1037, req.sessionID);
			// console.log('设置setUID：' + setUidResult);
			console.log(setUidResult);
			console.log('req.sessionID==' + req.sessionID);

			req.session.accessToken = {
				accessToken: (new Date().getTime()),
				name: 'yangyue123',
				uid: 1037,
				accessRight: {
					'0': 0
				} // 权限
			};

			var gotoUrl = req.session.url ? req.session.url : '/';
			if (gotoUrl == '/favicon.ico') {
				gotoUrl = '/';
			}
			req.session.url = null;

			log.info(JSON.stringify({
				type: 'login.do',
				status: 'success',
				msg: '用户[' + 'yangyue123' + ']登录成功',
				error: false
			}));
			res.redirect(gotoUrl);
		})*/
	},

	sendEmailDo: function(req, res, next) { // 注册用户
		var unionId = req.body.unionId;
		var flag = req.body.flag;
		request.post({
			url: userCenter.sendEmail.url,
			form: {
				unionId: unionId,
				flag: flag
			}
		}, function(err, httpResponse, body) {
			if (err) {
				log.error(JSON.stringify({
					type: 'sendEmail.do',
					status: 'failure',
					msg: 'requestError,请求异常',
					unionId: unionId,
					flag: flag,
					error: err
				}));
				res.jsonp({
					success: false,
					code: 500,
					msg: '请求异常',
					error: err
				});
				return false;
			} else {
				var result = null;
				try {
					result = JSON.parse(body);
				} catch (e) {
					log.error(JSON.stringify({
						type: 'sendEmail.do',
						status: 'failure',
						msg: 'parseBodyError,返回参数解析失败',
						unionId: unionId,
						flag: flag,
						error: e
					}));
					result = {
						code: 'parseErr',
					}
				}
				var MSG = {
					code: result.code,
					success: false
				};
				if (result.code == 0) {
					MSG.success = true;
					log.info(JSON.stringify({
						type: 'sendEmail.do',
						status: 'success',
						msg: '验证码发送成功',
						unionId: unionId,
						flag: flag,
						error: false
					}));
				} else if (result.code == 10001) {
					MSG.msg = '用户中心服务器内部错误';
					log.warn(JSON.stringify({
						type: 'sendEmail.do',
						status: 'success',
						msg: '用户中心服务器内部错误',
						unionId: unionId,
						flag: flag,
						error: false
					}));
				} else if (result.code == 10002) {
					MSG.msg = '参数错误';
					log.warn(JSON.stringify({
						type: 'sendEmail.do',
						status: 'success',
						msg: '参数错误',
						unionId: unionId,
						flag: flag,
						error: false
					}));
				} else if (result.code == 10101) {
					MSG.msg = '该账号已经注册过了，请您直接登录';
				} else if (result.code == 'parseErr') {
					MSG.msg = '返回参数解析失败';
				} else {
					MSG.msg = '验证码发送失败,请您联系管理员后重试';
					log.warn(JSON.stringify({
						type: 'sendEmail.do',
						status: 'success',
						msg: '错误编码' + result.code,
						unionId: unionId,
						flag: flag,
						error: false
					}));
				}
				res.jsonp(MSG);
				return false;
			}
		});
	},

	errorPage: function(req, res, next) { // 错误页
		var status = req.params.status || 'login';
		var info = {
			code: 666,
			message: '系统检测到您主动访问了错误的页面，将在三十秒后爆炸！',
			title: '警报'
		};
		if (status == 403) {
			info = {
				message: '很抱歉，您的权限不足，无法访问！',
				code: 403,
				title: '欢迎来到月球,但是...'
			}
		} else if (status == 404) {
			info = {
				message: '抱歉，您所访问的页面不存在！',
				code: 404,
				title: '雾霾太大，啥都没找到~'
			}
		} else if (status == 500) {
			info = {
				message: '抱歉，服务器后台异常，疑似被外星人入侵！',
				code: 500,
				title: '快通知消防队员'
			}
		}
		res.render(viewpath + 'error/index', {
			title: '出错啦',
			info: info
		});
	},

	// 首页
	home: function(req, res, next) {
		res.render(viewpath + 'home/index', {
			// userName: req.session.accessToken.name,
			// access: req.session.accessToken,
			// platformId: PLATFORMID,
			title: 'Stockmood'
		});
	}
};

module.exports = systemController;