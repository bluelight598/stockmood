/*
 *  后端接口路由——GET接口
 *      系统将会读取此配置并添加至路由中，并使用GET Handler进行转发
 */
var getSettings = function() { // 部分接口可能不需要NODE端转发，则直接通过后端URL调用
    if (typeof window != 'undefined') { // for Font-end ENV
        if (window.location.host == 'platform.100credit.com') {
            return '//platform.100credit.com';
        } else {
            return '//dymapi.100credit.com';
        }
    }
    return 'http://dymapi.100credit.com';
};

var host = getSettings();

module.exports = {
    xiaqiu: { // 虾球
        user_participation: { // 虾球 - 用户参与度
            newUserConversion: { // 虾球 - 用户参与度 - 新客转化
                getCharts: '/statisticsapi/bi/newcust/funnel', // 虾球 - 用户参与度 - 新客转化 - 获取echarts图表
                getTable: '/statisticsapi/bi/newcust/list', // 虾球 - 用户参与度 - 新客转化 - 获取table
            },
            visitPage: {
                webpage: '/spmapi/webpage/toWebPage', // 虾球 - 用户参与度 - 访问页面 - 获取状态豆腐块
                getCharts: '/spmapi/webpage/getCharts', // 虾球 - 用户参与度 - 访问页面 - 访问次数线图
                getTableData: '/spmapi/webpage/getTableData' // 虾球 - 用户参与度 - 访问页面 - 详情列表
            }
        },
        trend_manager: { // 虾球 - 渠道管理
            trendList: {
                toChannel: '/spmapi/channel/toChannel', // 虾球 - 渠道管理 - 趋势列表 - 趋势图
                getCharts: '/spmapi/channel/getCharts' // 虾球 - 渠道管理 - 趋势列表 - 趋势图
            },
            trendPlatform: {
                getPlantFormTableData: '/spmapi/channel/getPlantFormTableData' // 虾球 - 渠道管理 - 平台列表 - 表格数据
            },
            trendTable: { // 下载渠道列表
                listChannel: '/spmapi/channel/listChannel', // 虾球 - 渠道管理 - 下载渠道列表 - 获取下拉选项
                getTableData: '/spmapi/channel/getTableData' // 虾球 - 渠道管理 - 下载渠道列表 - 列表数据
            },
            regTrendTable: { // 注册渠道列表
                listType: '/spmapi/channel/listType', // 虾球 - 渠道管理 - 注册渠道列表 - 级联菜单1 - 获取渠道类型option
                listRegisterChannel: '/spmapi/channel/listRegisterChannel', // 虾球  -  渠道管理 - 注册渠道列表 - 级联菜单1 - 获取注册渠道字典
                listParentChannel: '/spmapi/channel/listParentChannel', // （新）虾球  -  渠道管理 - 注册渠道列表 - 级联菜单2 - 获取渠道名称option
                listChannel: '/spmapi/channel/listChannel', // 虾球 - 渠道管理 - 注册渠道列表 - 级联菜单3 - 获取渠道ID option
                getTableData: '/spmapi/day_channel/getTableData' // 虾球  -  渠道管理 - 注册渠道列表 - 列表数据
            },
            appStore: {
                getStatusData: '/spmapi/appstore/getStatusData', // 虾球 - 渠道管理 - 应用商店 - 豆腐块
                getCharts: '/spmapi/appstore/getCharts', // 虾球 - 渠道管理 - 应用商店 - 折线图
                getTableData: '/spmapi/appstore/getTableData' // 虾球 - 渠道管理 - 应用商店 - 明细数据
            }
        },
        user_portrait: { // 虾球 - 用户画像
            portrait: { // 用户画像
                getChannels: '/ibuportrait/getChannels', // 虾球 - 用户画像 - 用户画像 - 用户画像二期获取渠道类型
                getAges: '/ibuportrait/getAges', // 虾球 - 用户画像 - 用户画像 - 用户画像二期获取年龄数据
                getGenders: '/ibuportrait/getGenders', // 虾球 - 用户画像 - 用户画像 - 获取性别的请求
                getSystems: '/ibuportrait/getSystems', // 虾球 - 用户画像 - 用户画像 - 获取操作系统
                getSids: '/ibuportrait/getSids', // 虾球 - 用户画像 - 用户画像 - 获取进件数量
                getTelOnLineTimes: '/ibuportrait/getTelOnLineTimes', // 虾球 - 用户画像 - 用户画像 - 获取电话在线时长
                getLoanCardMonthlyAvgOutcomes: '/ibuportrait/getLoanCardMonthlyAvgOutcomes', // 虾球 - 用户画像 - 用户画像 - 放款卡月均支出情况
                getAllCardMonthlyAvgOutcomes: '/ibuportrait/getAllCardMonthlyAvgOutcomes', // 虾球 - 用户画像 - 用户画像 - 所有卡的支出情况
                getAllCardMonthlyAvgIncomes: '/ibuportrait/getAllCardMonthlyAvgIncomes', // 虾球 - 用户画像 - 用户画像 - 所有的收入情况
                getInOutStatus: '/ibuportrait/getInOutStatus', // 虾球 - 用户画像 - 用户画像 - 获取收支情况
                getHoldCards: '/ibuportrait/getHoldCards', // 虾球 - 用户画像 - 用户画像 - 获取持卡数量
                getUserMaps: '/ibuportrait/getUserMaps' // 虾球 - 用户画像 - 用户画像 - 获取地图
            },
        }
    },
    rongshu: { // 榕树

    }
};