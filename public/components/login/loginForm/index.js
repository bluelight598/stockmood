import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import './index.less';

import { getUrlQuery } from '../../../lib/util';


/*const renderField = ({input, label, type, meta: {touched, error, warning,asyncValidating}}) => (
    <li>
	    <div className={asyncValidating ? 'async-validating' : ''}>
	    	<input {...input} placeholder={label} type={type}/>
	    </div>
	    <div className="form-tips-warpper">
	      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
	    </div>
    </li>
)*/

class LoginForm extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    renderField({input, label, type, meta: {touched, error, warning,asyncValidating}}) {
    	return (<li>
		    <div className={asyncValidating ? 'async-validating' : ''}>
		    	<input {...input} placeholder={label} type={type}/>
		    </div>
		    <div className="form-tips-warpper">
		      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
		    </div>
	    </li>)
    }

    componentDidMount() {
		const urlQuery = getUrlQuery('status');
        this.props.setTipsInfo(urlQuery.status);
    }

    componentDidUpdate() {
    }

    submitLogin(values) {
    	console.log(`submitLogin -> ${JSON.stringify(values)}`)
    }

    render() {
        const {handleSubmit, pristine, reset, submitting, setTipsInfo, tipsInfo} = this.props;
        return (
        	<section className="login-form-container">
        		<div className="login-tips-message">{tipsInfo}</div>
	            <form className="login-form-warpper" onSubmit={handleSubmit}>
			    	<ul>
				      	<Field
				            id="J_emailIpt"
				            name="email"
				            component={this.renderField}
				            type="email"
				            label="注册邮箱"
				        />
				      	<Field
				            id="J_passwdIpt"
				            name="passwd"
				            component={this.renderField}
				            type="password"
				            label="登录密码"
				        />
			    	</ul>
			    	<ButtonToolbar className="form-tool-buttons">
			    		<Button bsStyle="link" style={{'textDecoration': 'underline'}}>忘记密码</Button>
			    		<Button bsStyle="primary" onClick={setTipsInfo.bind(this,'2')} >&nbsp;注册&nbsp;</Button>
			    		<Button bsStyle="success" type="submit" disabled={pristine || submitting}>&nbsp;登录&nbsp;</Button>
			    	</ButtonToolbar>
			    </form>
        	</section>
        );
    }
}

const validate = values => {
    const errors = {}
    if (!values.email) {
        errors.email = '邮箱不能为空'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = '邮箱格式错误'
    }
    if (!values.passwd) {
        errors.passwd = '密码不能为空'
    }
    return errors
}

const LoginFormComponets = connect(state => { // connect( return state, Actions );
    let { form, AReducer } = state;
    console.log('get connect..')
    return {
    	tipsInfo: AReducer.tipsInfo
    }
}, {
	setTipsInfo: (status) => { // 根据状态设置显示 提示信息
		console.log(`setTipsInfo.value = ${status}`)
		return {
	        type: 'setTipsInfo',
	        status: status
	    }
	}

})(LoginForm);

export default reduxForm({
    form: 'login-form', // a unique identifier for this form
    validate,
    initialValues: { // todo 记录用户名，密码，从cookie中读取
    	email: '',
    	passwd: ''
    }
})(LoginFormComponets);
// })(LoginForm);