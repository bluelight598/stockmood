var mongoose = require('mongoose');
var bluebird = require('bluebird');
var thunkify = require('thunkify');
mongoose.Promise = require('bluebird');

// 股票信息数据库
var stockDB = mongoose.createConnection('mongodb://localhost/DB_STOCK', {
	server: {
		auto_reconnect: true
	},
	replset: {
		poolSize: 4
	},
	promiseLibrary: bluebird
});
stockDB.on('close', function() {
	stockDB = mongoose.createConnection('mongodb://localhost/DB_STOCK', {
		server: {
			auto_reconnect: true
		},
		replset: {
			poolSize: 4
		},
		promiseLibrary: bluebird
	});
});

// 股票基础信息 
var SHEET_US_DAILY_LIST_SCHEMA = new mongoose.Schema({ // 股票基础信息 - 数据结构
	name: String,
	symbol: String,
	industry: String,
	market_cap: String,
	sector: String,
	}, {
	collection: 'SHEET_US_DAILY_LIST'
});
var SHEET_US_DAILY_LIST_MODEL = stockDB.model('SHEET_US_DAILY_LIST', SHEET_US_DAILY_LIST_SCHEMA, 'SHEET_US_DAILY_LIST'); // 股票信息 - model
SHEET_US_DAILY_LIST_MODEL.find = thunkify(SHEET_US_DAILY_LIST_MODEL.find);

// 股票价格信息
var SHEET_US_DAILY_DATA_SCHEMA = new mongoose.Schema({ // 股票价格信息 - 数据结构
	symbol: String,
	metadata: {
		name: String,
		last_update: Date
	},
	data: mongoose.Schema.Types.Mixed
	}, {
	collection: 'SHEET_US_DAILY_DATA'
});
var SHEET_US_DAILY_DATA_MODEL = stockDB.model('SHEET_US_DAILY_DATA', SHEET_US_DAILY_DATA_SCHEMA, 'SHEET_US_DAILY_DATA'); // 股票价格日常 - model
SHEET_US_DAILY_DATA_MODEL.find = thunkify(SHEET_US_DAILY_DATA_MODEL.find);

// 股票相关新闻
var SHEET_US_NEWS_SCHEMA = new mongoose.Schema({ // 股票价格信息 - 数据结构
	symbol: String,
	data: mongoose.Schema.Types.Mixed,
	metadata: {
		name: String,
		last_update: Date
	}
	}, {
	collection: 'SHEET_US_NEWS'
});
var SHEET_US_NEWS_MODEL = stockDB.model('SHEET_US_NEWS', SHEET_US_NEWS_SCHEMA, 'SHEET_US_NEWS'); // 股票价格日常 - model
SHEET_US_NEWS_MODEL.find = thunkify(SHEET_US_NEWS_MODEL.find);

// 股票关联性
var SHEET_US_RELA_SCHEMA = new mongoose.Schema({ // 股票价格信息 - 数据结构
	company1: String,
	company2: String,
	correlation: String,
	}, {
	collection: 'SHEET_US_RELA'
});
var SHEET_US_RELA_MODEL = stockDB.model('SHEET_US_RELA', SHEET_US_RELA_SCHEMA, 'SHEET_US_RELA'); // 股票价格日常 - model
// SHEET_US_RELA_MODEL.find = thunkify(SHEET_US_RELA_MODEL.find);

module.exports = stockDB;