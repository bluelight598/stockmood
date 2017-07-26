import React from 'react';
// import { Field, reduxForm } from 'redux-form';
// import { Button, ButtonToolbar } from 'react-bootstrap';
// import { connect } from 'react-redux';
// import './index.less';

// import { getUrlQuery } from '../../../lib/util';

class SearchInput extends React.Component {
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
        // const { doLogin, doSignUp } = this.props;
        // console.log(`SearchInput render, this.props =>`);
        // value={this.props.search.currentValue}

         // onKeyUp={this.props.searchInputKeyUp.bind(this)} onFocus={this.props.searchInputFocus.bind(this)} onBlur={this.props.searchInputBlur.bind(this)} onChange={this.props.searchInputChange.bind(this)}
            // <input id="search-inputer" className="iconfont" placeholder="&#xe611;&nbsp;Find your stock" onKeyUp={this.props.searchInputKeyUp.bind(this)} onFocus={this.props.searchInputFocus.bind(this)} onBlur={this.props.searchInputBlur.bind(this)} onChange={this.props.searchInputChange.bind(this)} />
        return (
        	<section className="search-input-container">
        		<input id="search-inputer" placeholder="Find your stock" onKeyUp={this.props.searchInputKeyUp.bind(this)} onFocus={this.props.searchInputFocus.bind(this)} onBlur={this.props.searchInputBlur.bind(this)} onChange={this.props.searchInputChange.bind(this)} />
                <i className="search-icon">&#xe611;</i>
        	</section>
        );
    }
}

export default SearchInput;