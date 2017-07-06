/*
 *  后端接口路由——直接访问接口
 *      这里面配置的接口将不会被NodeJs鉴权，直接发送至后端服务器。
 *		可以防止当session失效后，监控页无法继续通过接口获取数据；也可以将不需要前端鉴权或转发的接口添加至此。
 */
var getSettings = function () {
    if (window.location.host == 'platform.100credit.com') {
        return '//platform.100credit.com';
    } else {
        return '//dymapi.100credit.com';
    }
};

var host = getSettings();

module.exports = {
   xiaqiu: {
   		data_monitor: {
   			liveStatus: {
   				getBoard: host + '/statisticsapi/screen/getBoard.do', // 虾球 - 数据监控 - 实时监控 - 整体和实时趋势
	            getDetailsList: host + '/ibuplatform/getDetailsList', // 虾球 - 数据监控 - 实时监控 - 大table数据(张亚东更新后的接口)
	            getCharts: host + '/statisticsapi/screen/getCharts.do' // 虾球 - 数据监控 - 实时监控 - 获取折线数据
   			},
   			loanStatus: {
            	getNewRiskList: host + '/riskapi/risk/getNewRiskList' // 虾球 - 数据监控 - 借款记录
   			}
   		}
   }
};