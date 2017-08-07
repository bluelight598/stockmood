import React from 'react';
import { connect } from 'react-redux';
import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);
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

    componentDidUpdate() {}

    render() {
        const {barType} = this.props;
        if (barType == 'home') {
            return (
                <section className="nav-container nav-home">
              <div className="nav-warpper clearfix">
                <NavLoginBar {...this.props}></NavLoginBar>
              </div>
            </section>
            );
        } else if (barType == 'default') {
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
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        showLoginSideBar() {
            dispatch({
                type: 'SHOW_LOGIN_SIDEBAR'
            })
        },
        getUserLogout() {
          $.get('/api/getUserLogout.do')
              .then(function(response) {
                  const body = response.body;
                  if (body.code == 0) {
                      dispatch({
                          type: 'CHECK_LOGIN_STATUS',
                          userInfo: false
                      });

                  } else {
                    console.log('登出失败');
                  }
              }).catch(function(err) {
              console.log(err)
          });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);