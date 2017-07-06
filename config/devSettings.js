var logManager = require('../dal/logger');
var log = logManager.getLogger('systemService');
var settings = {
	host: 'earth.cobarla.com',
	platformId: 1,
	// mysql: {
	// 	limit: 15,
	// 	ip: '47.93.225.251', // 日常环境
	// 	username: 'saturn',
	// 	password: '123abc!@#',
	// 	database: 'saturn',
	// 	port: '3306'
	// },
	mysql: {
		limit: 15,
		ip: '127.0.0.1', // 杨岳本地测试
		database: 'saturn',
		username: 'root',
		password: 'sa',
	},
	session: {
		redisStore: {
			host: '127.0.0.1', // 本地redis存储
			// host: '192.168.180.10', // 公司日常redis存储
			port: 6379,
			db: 0,
			ttl: 21600000,
			prefix: 'cobarla:sessionId:',
			logErrors: function(e) {
				log.error('redisStore:连接异常');
				log.error(e);
			}
		}
	},
	redisClient: {
		host: '127.0.0.1', // 本地redis存储
		// host: '192.168.180.10', // 公司日常redis存储
		port: 6379,
		db: 0,
		prefix: 'cobarla:sessionId:'
	},
	emailSettings: {
		server: {
			user: 'hostmaster@100credit.com',
			password: 'nPK0Yk7vyz',
			host: 'smtp.100credit.com',
			ssl: false
		}
	}
};

module.exports = settings;