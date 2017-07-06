/*
 * 身份认证规则配置
 * 管理员专属页面不需要在此设置
 */
module.exports = {
    route: {
        root: [ // 管理员才可访问的内容 -- 无需进行检测，此处url只是为了记录root才可访问的页面
            /^\/api\/system\/getAuths.do/, // 管理员-权限管理-查询指定用户权限
            /^\/api\/system\/addAuth.do/, // 管理员-权限管理-设置指定用户权限
            /^\/api\/system\/getAllUsers.do/, // 管理员-权限管理-查询全部用户权限
        ],
        free: [ // 系统级别路由，无需登录即可进行访问
            /^\/system\/error(\/((\-)?\d+)?)?/, // 错误页 示例：/system/error,/system/error/,/system/error/404,/system/error/403
            /^\/system\/login(\/((\-)?\d+)?)?/, // 登录页 示例：/system/login,/system/login/,/system/login/-2,/system/login/1
            /^\/api\/system\/sendEmail\.do/, // 用户中心-发送邮箱验证码 示例：/system/sendEmail.do
            /^\/api\/system\/register\.do/, // 用户中心-注册 示例：/system/register.do
            /^\/api\/system\/forget\.do/, // 用户中心-忘记密码 示例：/system/forget.do
            /^\/api\/system\/login\.do/, // 用户中心-登录 示例：/system/login.do
            /^\/api\/system\/logout\.do/, // 用户中心-登出 示例：/system/logout.do
            /^\/public\//, // public静态资源
            /^\/images\//, // 图片资源
            /^\/c\//, // 前端js、样式 静态资源
            /^\/assets\//, // 前端模板 静态资源
            /^\/\_\_webpack\_hmr/, // 开发webpack
            /^\/stocks$/
        ],
        allow: [ // 路由白名单，登录后任何人都可以访问
            /^\/$/, // 根 页面
            /^\/stockDemo/, // 股市资讯demo
            /^\/stocks$/
        ],
        app: { // 应用列表，超级管理员-0 owner-4 master-3 staff-2 guest-1；Value越大，权限越高。rules中对应的路由代表可以访问该页面时，所需要的最低权限。
            '1': {
                name: '股市资讯',
                rules: {
                    '1': [ // guest权限，只能访问free、和'1'中路由的内容
                    ],
                    '2': [ // staff权限，可以访问free、'1'、'2'中路由的内容
                    ],
                    '3': [ // master权限，可以访问free、'1'、'2'、'3'中路由的内容
                    ],
                    '4': [ // owner权限，可以访问free、'1'、'2'、'3'、'4'中路由的内容
                    ]
                }
            }
        }
    }
};