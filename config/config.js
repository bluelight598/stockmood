/*
 * @fileOverview 服务器相关配置
 * @author leo.yy
 */

var express = require('express'),
	path = require('path'),
	bodyParser = require("body-parser"),
	// $ = require('underscore'),
	logger = require('morgan'); //后台log模块

var favicon = require('serve-favicon');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logManager = require('../dal/logger');
var log = logManager.getLogger('systemService');
var lessMiddleware = require('less-middleware');
var access = require('../routes/access');
var CONFIG = require('./settings');
var RedisStore = require('connect-redis')(session);
var isDev = (process.env.NODE_ENV == 'dev');

module.exports = function(app, rootPath) {

	app.set('case sensitive routing', true); //大小写敏感的路由模式
	app.set('view engine', 'ejs'); //模板引擎
	app.set('view cache', false); //模板缓存
	app.use(favicon(path.join(rootPath, 'favicon.ico')));
	app.use(bodyParser.json({
		limit: '80mb'
	}));
	app.use(bodyParser.urlencoded({
		limit: '80mb',
		extended: true,
		parameterLimit: 50000
	}));
	app.use(cookieParser()); // 应用cookie及session
	app.use(logger('dev')); //后台log模块,参数有:combined\dev等。若想记录全部请求，应把它放在第一行位置。

	/*
	 * redis持久化session，服务端session丢失后，并尝试三次重连接，github上给出的手动查找session的解决方案。稳定性有待测试
	 */
	var sessionMiddleware = session({
		name: 'sid',
		secret: 'Asecret123-',
		resave: true,
		rolling: true,
		saveUninitialized: false,
		cookie: {
			// domain: 'cobarla.com',
			httpOnly: true,
			maxAge: 43200000 // 12*3600*1000
		},
		// store: new RedisStore(CONFIG.session.redisStore)
		store: (function(){
			console.log('now on redis store')
			return new RedisStore(CONFIG.session.redisStore);
		})()
	});
	app.use(function(req, res, next) {
		var tries = 3

		function lookupSession(error) {
			if (error) {
				return next(error)
			}
			tries -= 1
			if (req.session !== undefined) {
				return next()
			}
			if (tries < 0) {
				log.error('config.js检测到Redis失联！！！！');
				log.error('How do I handle lost connections to Redis?By default, the node_redis client will auto-reconnect when a connection is lost. But requests may come in during that time. In express, one way this scenario can be handled is including a "session check" after setting up a session (checking for the existence of req.session):');
				log.warn('可以参考https://github.com/expressjs/session/issues/99#issuecomment-63853989，如何解决');
				return next(new Error('由于您的网络不稳定，导致redis连接断开，请尝试刷新当前页面。'));
			}
			sessionMiddleware(req, res, lookupSession);
		}
		lookupSession();
	});

	// app.use(function(req, res, next) {
	// 	access(req, res, next);
	// });

	/*
	 * Webpack集成开发环境 及 线上环境
	 */
	if (isDev) {
		log.debug('Dev环境构建开始...');
		var startBuildTime = new Date().getTime();
		var webpack = require('webpack'),
			webpackDevMiddleware = require('webpack-dev-middleware'),
			// webpackHotMiddleware = require('webpack-hot-middleware'),
			webpackDevConfig = require('../webpack.config.dev.js');
		var compiler = webpack(webpackDevConfig);
		app.use(webpackDevMiddleware(compiler, {
			hot: false,
			publicPath: webpackDevConfig.output.publicPath,
			noInfo: false,
			lazy: false,
			stats: {
				colors: true
			}
		}));
		// app.use(webpackHotMiddleware(compiler));
		var totalBuildTime = (new Date().getTime() - startBuildTime) / 1000;
		log.debug('Dev环境构建结束，共耗时：' + totalBuildTime + 's');
	}
	
	app.use(lessMiddleware(path.join(__dirname, '../public'))); // 使用less

	require('../routes')(app); //加入路由
	app.use(express.static(path.join(rootPath, 'public'))); //设置静态文件默认路径
};