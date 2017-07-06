/*
 * @fileOverview 服务器状态码
 * @author leo.yy
 */
var CODE = {
	SUCCESS: {
		code: '0',
		message: '成功'
	},
	SERVER_INNER_ERROR: {
		code: '50001',
		message: '服务端内部错误'
	},
	SERVER_EXECUTE_MYSQL_ERROR: {
		code: '50002',
		message: '数据库操作执行错误'
	},
	SERVER_EXECUTE_REDIS_ERROR: {
		code: '50003',
		message: 'Redis操作执行错误'
	},
	SERVER_NOT_FOUND: {
		code: '40400',
		message: '没有找到相关路径'
	},
	PARAMETER_ERROR: {
		code: '10001',
		message: '参数错误'
	},
};

module.exports = CODE;