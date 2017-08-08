/*
 * @fileOverview 股市资讯 路由controller
 * @author leo.yy
 */

'use strict';

var CONFIG = require('../../config/settings');
var PLATFORMID = CONFIG.platfromId;
var stockApi = require('./api');
var logManager = require('../../dal/logger');
var log = logManager.getLogger('webService');
var mongoose = require('../../dal/mongodb/');
var co = require('co');
var thunkify = require('thunkify');

var userCenterController = {
    init: function(app) {
        app.get('/stockhome', this.stockhome); // Stockmood 首页
        app.get('/stock/getStockListAsLike.do', stockApi.getStockListAsLike); // Stockmood Search like查询mongo stock
        app.get('/stock/getStockChartPreview.do', stockApi.getStockChartPreview); // Stockmood 首页 - 获取底部stock预览小图option 接口
        app.get('/stock/goToStockDetail.do', stockApi.goToStockDetail); // Stockmood Search 回车键操作 -> 返回关键字匹配到的权重最高的stock信息
        app.get('/stockDetailList/:symbol/', this.stockDetailList); // Stockmood 详情列表页
        app.get('/stock/getMainChart.do', stockApi.getMainChart); // Stockmood 详情页 - 获取stock详情图表 option
        app.get('/stock/getNewsList.do', stockApi.getNewsList); // Stockmood 详情页 - 获取 [相关新闻]栏目 列表
        app.get('/api/getUserLogin.do', stockApi.getUserLogin); // 登录mock接口
        app.get('/api/getUserLogout.do', stockApi.getUserLogout); // 登出mock接口
        app.get('/api/checkUserLogin.do', stockApi.checkUserLogin); // 检测用户登录接口
        app.get('/stockDetail', this.stockDetail); // Stockmood 详情页
        app.get('/stock/getNewsDetail.do', stockApi.getNewsDetail); // Stockmood 详情页 - 获取新闻详情
        app.get('/stock/getStockRELA.do', stockApi.getStockRELA); // Stockmood 详情页 - 获取新闻详情
        
    },
    stockhome: function(req, res, next) {
        res.render('./system/home/index', {
            title: 'Stockmood'
        });
    },
    stockDetailList: function(req, res, next) {
        var symbol = req.params.symbol;
        if (symbol) {
            co(function*() {
                var result = false;
                try {
                    var stockInfo = yield mongoose.stock_db.model('SHEET_US_DAILY_LIST').findOne({
                        'symbol': symbol
                    }); //.exec();
                    // stockInfo = JSON.parse(JSON.stringify(stockInfo)); // 此处有个坑，明明对象中包含name字段，就是取不到，必须强制转换一下在转成对象才可以。。。坑爹
                    var stockDaily = yield mongoose.stock_db.model('SHEET_US_DAILY_DATA').findOne({
                        'symbol': symbol
                    }); //.exec();
                    var stockLength = 0;
                    var stockRate = 0;
                    var stockPrecent = 0;
                    if (stockDaily == null) {
                        return res.send(`404找不到${symbol}相关的股票信息`);
                    }
                    try {
                        stockDaily.data = JSON.parse(stockDaily.data);
                        stockLength = stockDaily.data.length;
                        stockRate = Math.floor((stockDaily.data[stockLength - 1].close - stockDaily.data[stockLength - 2].close) * 1000) / 1000; // 涨跌幅 指数
                        stockPrecent = (stockRate / stockDaily.data[stockLength - 2].close * 100).toString().slice(0,6)+'%'; // 涨跌幅率
                    } catch (e) {
                        log.error(`/controller/stockmood/index.js - stockDetail - 数据解析错误`);
                        log.debug(stockDaily);
                        log.error(e);
                        return res.send(`数据解析错误`);
                    }

                    return res.render('./system/stock/stockDetailList/index', {
                        title: `Stockmood - ${stockInfo.symbol}`,
                        symbol: stockInfo.symbol,
                        name: stockInfo.name,
                        industry: stockInfo.industry,
                        close: Math.floor(stockDaily.data[stockLength - 1].close*100)/100,
                        stockRate: stockRate,
                        stockPrecent: stockPrecent
                    });
                } catch (e) {
                    log.error(`/controller/stockmood/index.js - stockDetail - 数据解析错误`);
                    log.error(e);
                    return res.send('系统异常');
                }
            });
        } else {
            return res.send('缺少参数：symbol');
        }
    },
    stockDetail: function(req, res, next) {
        return res.render('./system/stock/stockDetail/index', {
            title: `Stockmood - 文章详情`
        });
        /*var newsUri = req.params.newsUri;
        if (newsUri) {
            co(function*() {
                var result = false;
                try {
                    var stockNews = yield mongoose.stock_db.model('SHEET_US_NEWS').findOne({
                        'uri': newsUri
                    });

                    console.log(stockNews)
                   
                    if (stockNews == null) {
                        return res.send(`404找不到相关文章`);
                    }

                    res.send(stockNews)

                    
                } catch (e) {
                    log.error(`/controller/stockmood/index.js - stockDetail - 数据解析错误`);
                    log.error(e);
                    return res.send('系统异常');
                }
            });
        } else {
            return res.send('缺少参数：newsUri');
        }*/
    },
};

module.exports = userCenterController;