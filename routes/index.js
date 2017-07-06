/*
 * @fileOverview 路由核心入口代码
 * @author leo.yy
 */

'use strict';

module.exports = function(app) {
	require('../controllers/system').init(app); // 添加系统基础入口路由
	require('../controllers/stockmood').init(app);
}