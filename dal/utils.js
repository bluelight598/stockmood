/*
 * @fileOverview 工具组件
 * @author leo.yy
 */
var fs = require('fs');
var thunkify = require('thunkify');
var crypto = require('crypto');
var mysql = require('./mysql');
var child_process = require('child_process');
var logManager = require('./logger');
var log = logManager.getLogger('systemService');
var CONFIG = require('../config/settings');
var email = require('emailjs/email');
var emailSender = email.server.connect(CONFIG.emailSettings.server);
emailSender.send = thunkify(emailSender.send);

var REDIS = require("redis").createClient(CONFIG.redisClient);
REDIS.set = thunkify(REDIS.set);
REDIS.get = thunkify(REDIS.get);
REDIS.del = thunkify(REDIS.del);
REDIS.expire = thunkify(REDIS.expire);

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 

Date.prototype.Format = function(fmt) {   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

var utils = {
	response: function(req, res, data, code) {
		/*
		 * 自动根据请求类型返回json或jsonp (express res.json、res.jsonp的整合方法)
		 *	@ params : {
		 *		req: express req请求,
		 *		res: express res相应,
		 *		data: 准备返回给前端的数据对象,
		 *		code: 约定状态码对象（可不传，data中若带有code和message，将会覆盖code对象中的内容）
		 *  }
		 */
		var CODE = code ? code : {};
		console.log('===============')
		console.log(CODE)
		if (req.method == 'GET' && req.query.callback) {
			res.jsonp(Object.assign({}, CODE, data));
		} else {
			res.json(Object.assign({}, CODE, data));
		}
	},
	generateMixed: function(n) {
		/*
		 * 随机生成n位随机字符串
		 *	@params {
		 *		n <int>: 生成随机字符串的位数
		 * }
		 */
		var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		var res = '';
		for (var i = 0; i < n; i++) {
			var id = Math.ceil(Math.random() * 35);
			res += chars[id];
		}
		return res;
	},
	getPasswordA: function(passwd) {
		/*
		 * 前端首次用户密码加密算法
		 */
		if (!passwd) {
			return false;
		}
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
	},
	getPasswordB: function(passwd) {
		/*
		 * 后端二次用户密码加密算法
		 */
		if (!passwd) {
			return false;
		}
		var pas256 = crypto.createHash('sha256').update(passwd, 'utf8').digest('hex');
		var md5 = crypto.createHash('md5').update(passwd).digest('hex').toUpperCase();
		var newPassHash = md5.slice(0, 8) +
			pas256.slice(20, 28) +
			pas256.slice(0, 8) +
			md5.slice(10, 18) +
			md5.slice(8, 16) +
			pas256.slice(8, 16) +
			pas256.slice(14, 24) +
			md5.slice(21, 28);
		newPassHash = crypto.createHash('sha256').update(newPassHash, 'utf8').digest('hex');
		return newPassHash.slice(0, 32);
	},
	sendEmail: function*(emailMessage) {
		/*
		 * 发送邮件 同步方法
		 */
		var success = true;
		var result = false;
		try {
			result = yield emailSender.send(emailMessage);
		} catch (err) {
			success = false;
			log.error(JSON.stringify({
				type: 'buildChannelPkg/emailSender_failure',
				status: 'failure',
				msg: '发送邮件失败!',
				emailMessage: emailMessage
			}));
			log.error(err)
		}
		return {
			success: success,
			result: result
		};
	},
	getInsertSql: function(tableName, obj) {
		/*
		 * 生成INSERT语句通用函数
		 *	@Params: {
		 *		tableName<string>: 插入表名,
		 *		obj<>
		 *	}
		 */
		var keys = [];
		var values = [];
		var qArray = [];
		for (var key in obj) {
			keys.push(key);
			values.push(obj[key]);
			qArray.push('?');
		}
		var tmpSql = 'insert into ' + tableName + ' ( ' + keys.join(',') + ' ) values ( ' + qArray.join(',') + ' );'
		return this.getSql(tmpSql, values);
	},
	getSql: function(sqlTmp, sqlParams) {
		/*
		 * 生成安全sql语句
		 */
		var sql = '';
		try {
			sql = mysql.getSql(sqlTmp, sqlParams);
		} catch (error) {
			sql = '';
			log.error(JSON.stringify({
				type: 'util/getSql',
				status: 'failure',
				msg: '转换sql语句失败',
				sqlTmp: sqlTmp,
				sqlParams: sqlParams
			}));
			log.error(error);
		}
		return sql;
	},
	operateSql: function*(sql, msg) {
		/*
		 * 执行mysql语句，更新数据库，通用函数,
		 * @params
		 *  sql<string>: mysql语句（必须经过format的，否则会引起sql注入；否则请使用mysql.operateDB进行操作）,
		 *  msg<object>: {
		 *      success<string>: 成功日志描述,
		 *      failure<string>: 失败日志描述
		 *  }
		 */
		var result = [];
		var success = true;
		var message = msg || {
			success: '更新数据库成功',
			failure: '更新数据库失败'
		};
		try {
			result = yield mysql.operateSql(sql);
			log.debug(JSON.stringify({
				type: 'util/operateSql',
				status: 'failure',
				msg: message.success,
				sql: sql,
				error: null
			}));
		} catch (err) {
			success = false;
			log.error(JSON.stringify({
				type: 'util/operateSql',
				status: 'failure',
				msg: message.failure,
				sql: sql
			}));
			log.error(err);
		}
		return {
			success: success,
			result: result
		};
	},
	setRedis: function*(key, value, expire) {
		/*
		 * Redis Set操作
		 *	param {
		 *		key<string>: keyName,
		 *		value<string>: keyValue,
		 *		expire<int>: 过期时间（秒）,
		 *	}
		 */
		var success = true;
		var result = false;
		try {
			result = yield REDIS.set(key, value);
			if (expire) { // 设置过期时间(秒)
				yield REDIS.expire(key, expire);
			}
			log.debug(JSON.stringify({
				type: 'util/setRedis',
				status: 'success',
				msg: 'redis set success',
				key: 'cobarla:usercenter:' + key,
				value: value,
				expire: expire
			}));
		} catch (err) {
			success = false;
			log.error(JSON.stringify({
				type: 'util/setRedis',
				status: 'failure',
				msg: 'redis set error',
				key: key,
				value: value,
				expire: expire
			}));
			log.error(err);
		}
		return {
			success: success,
			result: result
		};
	},
	getRedis: function*(key) {
		/*
		 * Redis Get操作
		 *	param {
		 *		key<string>: keyName
		 *	}
		 */
		var success = true;
		var result = false;
		try {
			result = yield REDIS.get(key);
		} catch (err) {
			success = false;
			log.error(JSON.stringify({
				type: 'util/getRedis',
				status: 'failure',
				msg: 'redis get error',
				key: key
			}));
			log.error(err);
		}
		return {
			success: success,
			result: result
		};
	},
	delRedis: function*(key) {
		/*
		 * Redis Get操作
		 *	param {
		 *		key<string>: keyName
		 *	}
		 */
		var success = true;
		var result = false;
		try {
			result = yield REDIS.del(key);
		} catch (err) {
			success = false;
			log.error(JSON.stringify({
				type: 'util/delRedis',
				status: 'failure',
				msg: 'redis delete error',
				key: key
			}));
			log.error(err);
		}
		return {
			success: success,
			result: result
		};
	},
	expireRedis: function*(key, expire) {
		/*
		 * Redis 设置过期时间 操作
		 *	param {
		 *		key<string>: keyName,
		 *		expire<int>: 过期时间（秒）,
		 *	}
		 */
		var success = true;
		var result = false;
		try {
			result = yield REDIS.expire(key, expire);
		} catch (err) {
			success = false;
			log.error(JSON.stringify({
				type: 'util/expireRedis',
				status: 'failure',
				msg: 'redis expire error',
				key: key,
				expire: expire
			}));
			log.error(err);
		}
		return {
			success: success,
			result: result
		};
	},
	compareText: function(x, y, transCase) {
		/*
		 *	文字比较x与y的相似度，返回权重
		 *  @pramas {
	  	 *		x: <string || array>,  原始值
	  	 *		y: <string || array>,  比较值
	  	 *		transCase: <boolean>   是否支持大小写兼容
		 *  }
		*/
	    var z = 0;
	    if (typeof x == 'string') {
	        x = x.split('')
	    } 
	    if (typeof y == 'string') {
	        y = y.split('')
	    }
	    // var s1 = x.length + y.length; 
	    var s = y.length;;  
	    x.sort();  
	    y.sort();  
	    var a = x.shift();  
	    var b = y.shift();
	    while(a !== undefined && b !== undefined) {  
	    	if (transCase) {
		    	a = a.toLowerCase();
		    	b = b.toLowerCase();
		    }
	        if (a === b) {  
	            z++;  
	            a = x.shift();  
	            b = y.shift();  
	        } else if (a < b) {  
	            a = x.shift();  
	        } else if (a > b) {  
	            b = y.shift();  
	        }  
	    }  
	    // return z/s1 * 200;  // 返回 x 、 y 的相似度
	    return z/s * 100;  // 返回 x 对于 y 的相似度
	},
	exists: function(filePath) { // 同步判断是否存在文件
		return fs.existsSync(filePath);
	},
	execFileSync: thunkify(function(filePath, options, callback) { // 同步执行文件
		child_process.execFile(filePath, options, function(error, stdout, stderr) {
			return callback(error, stdout, stderr);
		});
	}),
	execSync: thunkify(function(command, options, callback) { // 同步执行文件
		child_process.exec(command, options, function(error, stdout, stderr) {
			return callback(error, stdout, stderr);
		});
	})
};
module.exports = utils;