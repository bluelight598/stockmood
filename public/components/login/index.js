import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);
// import util from '../../lib/util.js';
import './index.less';

class LoginBar extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentDidMount() {
    	this.props.checkUserLogin();
    }

    componentDidUpdate() {}

    userKeyUp(e) {
    	if(e.keyCode=='13') {
    		this.props.getUserLogin();
    	}
    }

    render() {
        let loginStatusClass = this.props.login.loginBarShow ? '' : 'J_disnone';
        return (
            <div className={`stock-login-container ${loginStatusClass}`}>
            	<div className="stock-login-mask" onClick={this.props.hideLoginSideBar}></div>
            	<div className="stock-login-warpper">
            		<div className="stock-login-header">
            			<div className="stock-login-logo-svg"></div>
            			<div className="stock-login-msg">{this.props.login.loginBarMSG}</div>
            		</div>
            		<div className="stock-login-body">
            			<input id="stock-login-user-input" type="text" placeholder="账号" onKeyUp={this.userKeyUp.bind(this)} />
            			<input id="stock-login-passwd-input" type="password" onKeyUp={this.userKeyUp.bind(this)} placeholder="密码" />
            			<a href="javascript:void(0);" className="J_doLoginBtn" onClick={this.props.getUserLogin.bind(this)}>登录</a>
            		</div>
            		<div className="stock-login-footer">
            			<a href="javascript:void(0);" className="J_registerBtn">注册</a>  |  <a href="javascript:void(0);" className="J_forgetPassBtn">忘记密码</a>
            		</div>
            	</div>
		    </div>
        );
    }
}
// export default LoginBar;
function mapStateToProps(state) {
    return state;
}

let actions = {
	checkUserLogin(e) {
        return (dispatch, getState) => {
            $.get('/api/checkUserLogin.do')
                .then(function(response) {
                    const body = response.body;
                    if (body.code == 0) {
                        dispatch({
                            type: 'CHECK_LOGIN_STATUS',
                            userInfo: body.userInfo
                        });
                        dispatch({
                        	type: 'INIT_LOGIN_FINISH'
                        });
                    } else {
                    	/*dispatch({
		                    type: 'SHOW_LOGIN_BAR_MSG',
		                    loginBarMSG: body.message
		                });*/
		                console.log('获取登录信息失败');
                    }
                }).catch(function(err) {
                	console.log(err)
            });

        }
    },
    getUserLogin(e) {
        return (dispatch, getState) => {
            let username = document.querySelector('#stock-login-user-input').value;
            let password = document.querySelector('#stock-login-passwd-input').value;
            if (username == '' || password == '') {
                dispatch({
                    type: 'SHOW_LOGIN_BAR_MSG',
                    loginBarMSG: '请输入正确的账号和密码'
                });
            } else {
                dispatch({
                    type: 'SHOW_LOGIN_BAR_MSG',
                    loginBarMSG: ''
                });
            }

            $.get('/api/getUserLogin.do')
                .query({
                	username: username,
                	password: password
                    // cv: encodeURIComponent(e.target.value)
                })
                .then(function(response) {
                    const body = response.body;
                    console.log(body)
                    if (body.code == 0) {
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            userInfo: body.data
                        });
                    } else {
                    	dispatch({
		                    type: 'SHOW_LOGIN_BAR_MSG',
		                    loginBarMSG: body.message
		                });
                    }
                }).catch(function(err) {
                	console.log(err)
            });

        }
    },

    /*getUserLogout(e) {
    	return (dispatch, getState) => {
            $.get('/api/getUserLogout.do')
                .then(function(response) {
                    const body = response.body;
                    console.log(body)
                    if (body.code == 0) {
                        // dispatch({
                        //     type: 'LOGIN_SUCCESS',
                        //     userInfo: body.data
                        // });
                    } else {
                  //   	dispatch({
		                //     type: 'SHOW_LOGIN_BAR_MSG',
		                //     loginBarMSG: body.message
		                // });
                    }
                }).catch(function(err) {
                	console.log(err)
            });

        }
    },*/

    hideLoginSideBar() {
        return (dispatch, getState) => {
            dispatch({
                type: 'HIDE_LOGIN_SIDEBAR'
            });
        }
    }
};

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBar);




