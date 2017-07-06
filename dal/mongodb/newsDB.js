var mongoose = require('mongoose');
var bluebird = require('bluebird');
var thunkify = require('thunkify');
mongoose.Promise = require('bluebird');

// 股票新闻数据库
var newsDB = mongoose.createConnection('mongodb://localhost/DB_STOCK', {
	server: {
		auto_reconnect: true
	},
	replset: {
		poolSize: 4
	},
	promiseLibrary: bluebird
});
newsDB.on('close', function() {
	newsDB = mongoose.createConnection('mongodb://localhost/DB_STOCK', {
		server: {
			auto_reconnect: true
		},
		replset: {
			poolSize: 4
		},
		promiseLibrary: bluebird
	});
});

var StockNewsSchema = new mongoose.Schema({ // 股票新闻 - 数据结构
	symbol: String,
	data: mongoose.Schema.Types.Mixed,
	metadata: mongoose.Schema.Types.Mixed
}, {
	collection: 'SHEET_US_NEWS'
});

var SheetUsNewsModel = newsDB.model('sheetUsNews', StockNewsSchema, 'SHEET_US_NEWS'); // 股票新闻 - model
SheetUsNewsModel.find = thunkify(SheetUsNewsModel.find);

module.exports = newsDB;
