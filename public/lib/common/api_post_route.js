/*
 *	后端接口路由——POST接口
 *      系统将会读取此配置并添加至路由中，并使用POST Handler进行转发
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
    
};