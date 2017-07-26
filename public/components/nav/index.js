import React from 'react';
// import { Field, reduxForm } from 'redux-form';
// import { Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import NavLoginBar from './NavLoginBar';
import Search from '../search/index';
import './index.less';

// import { getUrlQuery } from '../../../lib/util';

class Nav extends React.Component {
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
        // const {handleSubmit, pristine, reset, submitting, setTipsInfo, tipsInfo} = this.props;
        const { barType } = this.props;
        if (barType == 'home') {
          return (
            <section className="nav-container nav-home">
              <div className="nav-warpper clearfix">
                <NavLoginBar {...this.props}></NavLoginBar>
              </div>
            </section>
          );
        } else if (barType == 'default') {
                  // <div className="nav-logo-icon">IiI</div>
                  // <h1 className="nav-logo-title">Stockmood</h1>
                  // <object data="../../images/stockmood.svg" width="156" height="32" style={{'fill':'#1c5cb2'}} type="image/svg+xml" />
          return (
            <section className="nav-container nav-default">
              <div className="nav-warpper clearfix">
                <div className="nav-logo">
                  <a className="nav-logo-svg" href="/"></a>
                </div>
                <Search searchType="nav"></Search>
                <NavLoginBar {...this.props}></NavLoginBar>
              </div>
            </section>
          );
        } else {
          return '';
        }
        
    }
}

function mapStateToProps(state) {
	// console.log(`connect NavLoginBar, state is => ${JSON.stringify(state)}`)
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    doLogin () {
      dispatch({
        type: 'doLogin',
        name: 'yangyue',
        passwd: '123'
      })
    },
    doSignUp () {
      dispatch({
        type: 'doSignUp'
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);