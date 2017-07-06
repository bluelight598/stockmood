import React from 'react';
// import { Field, reduxForm } from 'redux-form';
// import { Button, ButtonToolbar } from 'react-bootstrap';
// import { connect } from 'react-redux';
// import './index.less';

// import { getUrlQuery } from '../../../lib/util';

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
        const { doLogin, doSignUp } = this.props;
        // console.log(`NavLoginBar render, this.props => ${JSON.stringify(this.props)}`);
        return (
        	<section className="nav-login-bar">
        		<a href="javascript:void(0);" className="nav-btns nav-signup-btn" onClick={doSignUp}>SIGN&nbsp;UP</a>
        		<a href="javascript:void(0);" className="nav-btns nav-login-btn" onClick={doLogin}>LOG&nbsp;IN</a>
        	</section>
        );
    }
}

export default NavLoginBar;