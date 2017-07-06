var getSettings = function() {
    if (typeof window != 'undefined') { // for Font-end ENV
        if (window.location.host == 'platform.100credit.com') {
            return '//platform.100credit.com';
        } else {
            return '//dymapi.100credit.com';
        }
    }
    if (typeof process != 'undefined') { // for Node ENV
        if (process.env.NODE_ENV == 'dev') {
            return 'http://dymapi.100credit.com';
        } else if (process.env.NODE_ENV == 'daily') {
            return 'http://dymapi.100credit.com';
        } else if (process.env.NODE_ENV == 'production') {
            return 'http://platform.100credit.com';
        } else {
            return 'http://dymapi.100credit.com';
        }
    }
    return 'http://dymapi.100credit.com';
};

var host = getSettings();

module.exports = {
    staffManager: { // 员工管理
        tacticsConfig: { // 策略管理页
            updateEdit: host + '', // 提交修改策略接口
        }
    },

    collectionManager: { // 催收系统api
        overdue: {
            sendSmsMsg: '/api/sender/sms/sendSms.do', //'http://192.168.23.229/sender/sms/sendSms.do' 发送短信接口
            getOverDueTable: '/api/recall/overdue/getRecallList.do', // 获取逾期未还列表
            getRepaymentTable: '/api/recall/overdue/getPayedRecallList.do', // 获取逾期已还列表
            getContactList: '/api/recall/overdue/getContactList.do', // 获取 通讯录
            getCallHistoryList: '/api/recall/overdue/getCallHistoryList.do' // 获取 通话记录
        }
    }
};