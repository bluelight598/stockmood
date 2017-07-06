/*
 * @fileOverview 应用入口
 * @author leo.yy
 */

var express = require('express');
var https = require('https');
var http = require('http');
var path = require('path');
var fs = require('fs');
var logManager = require('./dal/logger');
var utils = require('./dal/utils');
var CODE = require('./dal/code');
var log = logManager.getLogger('systemService');

// var ca = [];
// var cert = [];
var PORT = 3000;
// var SSLPORT = 3003;
// var privateKey = fs.readFileSync('cobarla.com.key', 'utf8'); // 日常证书
// var certificate = fs.readFileSync('cobarla.com.crt', 'utf8');
// var certificateTmp = certificate.split('\n');
// if (certificateTmp.length > 0) {
// 	for (var line in certificateTmp) {
// 		cert.push(line);
// 		if (line.match(/-END CERTIFICATE-/)) {
// 			ca.push(cert.join, '\n');
// 			cert = [];
// 		}
// 	}
// }
// var credentials = {
// 	ca: ca,
// 	key: privateKey,
// 	cert: certificate
// };
var app = express();
process.app = app; //方便在其他地方使用app获取配置
require('./config/config')(app, __dirname); //引入自定义配置文件

//错误处理
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
	log.error('ERROR:happened--------');
	log.error(err);
	log.error(err.stack);
});

app.use(function(req, res) {
	// res.redirect('/system/error/404');
	utils.response(req, res, {}, CODE.SERVER_NOT_FOUND);
});

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT, function() {
	log.info('HTTP服务已启动: http://localhost:%s', PORT);
});
// httpsServer.listen(SSLPORT, function() {
// 	log.info('HTTPS服务已启动: https://localhost:%s', SSLPORT);
// });

process.on('uncaughtException', function(err) {
	log.error('启动进程捕获到的未catch的异常：');
	log.error(err)
});