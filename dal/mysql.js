/*
 * @fileOverview mysql工具函数
 * @author leo.yy
 */

"use strict";

var pool = require('./pool');
var mysql = require('mysql');
var thunkify = require('thunkify');
var co = require('co');

exports.operateDB = thunkify(function(sql, params, callback) {
	/*
	 * 数据库:增删改查,使用了mysql的format做预编译防止sql注入
	 */
	var patt = new RegExp("%[0-9a-zA-Z]{2}'");
	params = patternNext(patt, params);
	sql = mysql.format(sql, params);
	pool.query(sql, function(err, results) {
		return callback(err, results);
	});
});

exports.operateSql = thunkify(function(sql, callback) {
	/*
	 *	sql必须是经过format的sql语句，否则会引起sql注入；
	 *	要想自动format，请使用mysql.operateDB函数进行操作
	 */
	pool.query(sql, function(err, results) {
		return callback(err, results);
	});
});

exports.operateDBCallBack = function(sql, params, callback) {
	var patt = new RegExp("%[0-9a-zA-Z]{2}'");
	params = patternNext(patt, params);
	sql = mysql.format(sql, params);
	pool.query(sql, function(err, results) {
		if (callback && typeof callback == 'function') {
			callback(err, results);
		}
	});
}

exports.getSql = function(sql, params) {
	var patt = new RegExp("%[0-9a-zA-Z]{2}'");
	params = patternNext(patt, params);
	sql = mysql.format(sql, params);
	return sql;
};

var patternNext = function(patt, params) {
	for (var i = 0; i < params.length; i++) {
		if (patt.test(params[i])) {
			params[i] = params[i].replace(/%[0-9a-zA-Z]{2}'/, '');
			params = patternNext(patt, params);
		}
	}
	return params;
};