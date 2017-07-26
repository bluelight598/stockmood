// var co = require('co');
// var thunkify = require('thunkify');
// var mongoStock = require('../dal/mongoStock.js');
// mongoStock.stockItemModel.find = thunkify(mongoStock.stockItemModel.find);

// var search = decodeURIComponent('BABA');
// var searchReg = new RegExp(search, 'i'); // i,不区分大小写
// var result = [];
// var startTime = new Date().getTime();
// co(function*() {
// 	try {
// 		result = yield mongoStock.stockItemModel.find({
// 			$or: [{
// 				"Symbol": {
// 					$regex: searchReg
// 				}
// 			}, {
// 				"Name": {
// 					$regex: searchReg
// 				}
// 			}]
// 		}, null, {
// 			// skip: (page - 1) * 3, // start
// 			limit: 4
// 		});
// 		console.log(result)
// 	} catch (err) {
// 		console.log(err);

// 	}
// 	var endTime = new Date().getTime();
// 	console.log(`getStockListAsLike -> 模糊查询 [ ${decodeURIComponent(search)} ] 成功，用时： ${endTime-startTime}`)
// });


// var mongoose = require('./mongodb.js').mongoose;

// var StockItemSchema = new mongoose.Schema({ // 股票信息 - 数据结构
// 	Index: mongoose.Schema.Types.Mixed,
// 	Symbol: mongoose.Schema.Types.Mixed,
// 	Name: String,
// 	MarketCap: String,
// 	Sector: String,
// 	Industry: String
// });

// var stockItemModel = mongoose.model('StockItem', StockItemSchema, 'StockList');

// console.log()

/*var mongoose = require('mongoose'); //引用mongoose模块
var db = mongoose.createConnection('localhost', 'STOCK_US'); //创建一个数据库连接

db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function() {
	//一次打开记录
	console.log('一次打开记录')
});

var StockItemSchema = new mongoose.Schema({ // 股票信息 - 数据结构
	Index: mongoose.Schema.Types.Mixed,
	Symbol: mongoose.Schema.Types.Mixed,
	Name: String,
	MarketCap: String,
	Sector: String,
	Industry: String
});

var stockItemModel = db.model('StockItem', StockItemSchema, 'StockList');

var SM = db.model('StockItem');

SM.find({Symbol:'BABA'},function(err, persons) {
	//查询到的所有person
	console.log(persons)
});*/

var co = require('co');
var thunkify = require('thunkify');
var mongoose = require('../dal/mongodb/');
var fs = require('fs');

// var SheetUsNewsModel = mongoose.stock_db.model('SHEET_US_NEWS');
co(function*(){
	/*var result = yield SheetUsNewsModel.findOne({symbol:'AMD'});
	console.log('SHEET_US_NEWS')
	console.log(result.data)
	console.log(result.symbol)
	console.log(typeof result)
	fs.writeFileSync('./abc.json',result);*/
	var search = '1st Constitution Bancorp (NJ)';
	// var search = '1st\\ Constitution\\ Bancorp\\ \\(NJ\\)';
	// search = search.split(' ').join('\\ ');
	// search = search.split('(').join('\\(');
	// search = search.split(')').join('\\)');
	console.log(search)
	var searchReg = new RegExp(search, 'i'); // i,不区分大小写
	console.log(searchReg)

	var result = yield mongoose.stock_db.model('SHEET_US_NEWS').findOne({});
	fs.writeFileSync('./abc.json',result);
	console.log(result)
});

// var stockItemModel = mongoose.stock_db.model('StockItem');
// co(function*(){
// 	var result = yield stockItemModel.find({Symbol:'BABA'});
// 	console.log('yangyue1')
// 	console.log(result)
// });


