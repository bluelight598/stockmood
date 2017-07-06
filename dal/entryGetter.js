/**
 * 
 * @fileOverview 获取/public/c/下面的所有index.js入口文件，并会根据根目录下的ecosystem.json下的avoidBuildList数组来过滤禁止build的文件，最后返回webpack entry，形式如下
 * @author leo.yy
 *	production: {
 *       'c/system/login': './public/c/system/login/index'
 *   },
 *	dev: {
 *       'c/system/login': ['./public/c/system/login/index', hotMiddlewareScript],
 *	}
 * 
 */
var path = require('path');
var fs = require('fs');
var logManager = require('./logger');
var log = logManager.getLogger('systemService');
var devFilePath = path.join(process.cwd(), './public/p');
var avoidList = require('../ecosystem.json').avoidBuildList || [];
var isInit = fs.existsSync(devFilePath, function(exists) { // 是否存在正常的目录结构
	return exists;
});
// var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
// var hotMiddlewareScript = 'webpack-hot-middleware/client';

var getEntries = function() {
	var entry = {
		dev: {},
		production: {}
	};
	var getJsEntry = function(dir) {
			fs.readdirSync(dir).forEach(function(file) {
				var pathname = path.join(dir, file);

				if (fs.statSync(pathname).isDirectory()) {
					getJsEntry(pathname);
				} else {
					if (/index\.js$/.test(pathname)) {
						var relFileName = './public/' + pathname.split('/public/')[1];
						var relFileKey = false;
						var relFileKeys = ('./p/' + pathname.split('/public/p/')[1]);
						relFileKeys = relFileKeys.match(/^(\.\/)([\s\S]+)(\/index\.js)$/i);
						if (relFileKeys && relFileKeys.length >= 4) {

							relFileKey = relFileKeys[2];
							if (avoidList.indexOf(relFileKey)==-1) { // 过滤根据根目录下的ecosystem.json下的avoidBuildList中的key
								entry.production[relFileKey] = relFileName.match(/([\s\S]+)(\.js)$/i)[1];
							}
							// entry.dev[relFileKey] = [relFileName.match(/([\s\S]+)(\.js)$/i)[1],hotMiddlewareScript];
							entry.dev[relFileKey] = [relFileName.match(/([\s\S]+)(\.js)$/i)[1]];
						}
					}
				}
			});
			return entry;
		}
	if (isInit) {
		return getJsEntry(devFilePath);
	} else {
		return {};
	}
};

var entries = getEntries();
log.info({
	type: 'getEntries',
	status: 'success',
	msg: 'webpack entries遍历成功',
	entries: JSON.stringify(entries)
});

module.exports = entries;