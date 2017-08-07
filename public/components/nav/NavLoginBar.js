import React from 'react';

class NavLoginBar extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentDidMount() {
		// const urlQuery = getUrlQuery('status');
        // this.props.setTipsInfo(urlQuery.status);
    }

    componentDidUpdate() {
    }

    render() {
        const { showLoginSideBar,login,getUserLogout } = this.props;
        if (login.isInitLogin) {
            if (login.isLogin) {
                return (
                    <section className="nav-login-bar">
                        <a href="javascript:void(0);" className="nav-btns nav-user-info" onClick={getUserLogout}>登出&nbsp;{login.userInfo.username}</a>
                    </section>
                );
            } else {
                return (
                	<section className="nav-login-bar">
                		<a href="javascript:void(0);" className="nav-btns nav-login-btn" onClick={showLoginSideBar}>LOG&nbsp;IN</a>
                        <a href="javascript:void(0);" className="nav-btns nav-signup-btn">SIGN&nbsp;UP</a>
                	</section>
                );
            }
        } else {
            return (
                <section className="nav-login-bar"></section>
            );
        }
    }
}

export default NavLoginBar;