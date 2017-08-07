/*
 * login组件Reducer
*/

function loginReducer(state = {
        isInitLogin: false,
        isLogin: false,
        loginBarShow: false,
        loginBarMSG: '',
        userInfo: false
    }, action) {
    switch (action.type) {
    case 'checkLogin':
        return {
            isLogin: state.isLogin
        }
    case 'doLogin':
    	console.log('doLogin')
        return state;
    case 'doSignUp':
    	console.log('doSignUp')
        return state;
    case 'SHOW_LOGIN_SIDEBAR': {
        return Object.assign({},state,{
            loginBarShow: true
        });
    }
    case 'HIDE_LOGIN_SIDEBAR': {
        return Object.assign({},state,{
            loginBarShow: false
        });
    }
    case 'SHOW_LOGIN_BAR_MSG': {
        return Object.assign({},state,{
            loginBarMSG: action.loginBarMSG
        });
    }
    case 'CHECK_LOGIN_STATUS': {
        let isLogin = action.userInfo;
        return Object.assign({},state,{
            isLogin: !!isLogin,
            userInfo: isLogin
        });
    }
    case 'LOGIN_SUCCESS': {
        return Object.assign({},state,{
            isLogin: true,
            loginBarShow: false,
            userInfo: action.userInfo
        });
    }
    case 'INIT_LOGIN_FINISH': {
        return Object.assign({},state,{
            isInitLogin: true
        });
    }
    default:
        return state;
    }
}

export default loginReducer;