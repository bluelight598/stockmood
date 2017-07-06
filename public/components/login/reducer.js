/*
 * login组件Reducer
*/

function loginReducer(state = {
        isLogin: false,
        userInfo: {}
    }, action) {
    switch (action.type) {
    case 'checkLogin':
        return {
            isLogin: state.isLogin
        }
    case 'doLogin':
    	console.log('doLogin')
        return {
            isLogin: 1
        }
    case 'doSignUp':
    	console.log('doSignUp')
        return {
            isLogin: 0
        }
    default:
        return state;
    }
}

export default loginReducer;