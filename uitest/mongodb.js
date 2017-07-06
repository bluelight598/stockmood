var mongoose = require('../dal/mongodb.js').mongoose;

var StockItemSchema = new mongoose.Schema({
	Index: mongoose.Schema.Types.Mixed,
	Symbol: mongoose.Schema.Types.Mixed,
	Name: String,
	MarketCap: String,
	Sector: String,
	Industry: String,
	array: Date
});

var stockItemModel = mongoose.model('StockItem', StockItemSchema, 'stock_list');

/*
 * 插入StockList到mongodb
 */
/*
var lists = [{"Index":"0","Symbol":"DDD","Name":"3D Systems Corporation","MarketCap":"2392299841.98","Sector":"Technology","Industry":"Computer Software: Prepackaged Software"},
{"Index":"1","Symbol":"MMM","Name":"3M Company","MarketCap":"1.27355367186e+11","Sector":"Health Care","Industry":"Medical/Dental Instruments"},
{"Index":"2","Symbol":"WBAI","Name":"500.com Limited","MarketCap":"384706846.56","Sector":"Consumer Services","Industry":"Services-Misc. Amusement & Recreation"},
{"Index":"2","Symbol":"FLWS","Name":"1-800 FLOWERS.COM, Inc.","MarketCap":"620683440.5","Sector":"Consumer Services","Industry":"Other Specialty Stores"},
{"Index":"3","Symbol":"WUBA","Name":"58.com Inc.","MarketCap":"5959598780.94","Sector":"Technology","Industry":"Computer Software: Programming, Data Processing"}];

for (var i = 0; i < lists.length; i++) {
	(function(i){
		var stockEntity = new stockItemModel(lists[i]);
		stockEntity.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log(`stockEntity [ ${i} ] [ ${lists[i].Symbol} ] save success`);
			}
		});
	})(i)
}
*/

/*
 * 查询指定item
 */
/*
stockItemModel.find({
	"Index": "0"
},function(err,data){
	if (err) {
		console.log(err);
	}else {
		console.log(data);
	}
});
*/

/*
 * 模糊查询
 */
var search = 'BA';
var searchReg = new RegExp(search);
stockItemModel.find({
	"Symbol": searchReg
}, null, {
	// skip: (page - 1) * 3, // start
	limit: 8
}, function(err, data) {
	if (err) {
		console.log(err);
	} else {
		console.log(data);
	}
});