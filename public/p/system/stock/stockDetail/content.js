import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ListProgram from '../../../../components/listProgram/index';
import { getUrlQuery } from '../../../../lib/util';
import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);

class DetailContent extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentWillMount() {}

    componentDidMount() {
        const urlQuery = getUrlQuery('uri');
        this.props.getNewsDetail(urlQuery.uri);
    }

    componentDidUpdate() {}

    componentWillUpdate() {}

    getEngBody() {
    	if (this.props.stockDetail.newsDetail) {
		    return (
		    	<div className="news-content-body-env" dangerouslySetInnerHTML={{__html: `${this.props.stockDetail.newsDetail.body_html}`}} />
		    	)
    	} else {
    		return '';
    	}
    }

    getCnBody() {
    	if (this.props.stockDetail.newsDetail) {
		    return (
		    	<div className="news-content-body-cn" dangerouslySetInnerHTML={{__html: `${this.props.stockDetail.newsDetail.body_chn}`}} />
		    	)
    	} else {
    		return '';
    	}
    }

    renderListProgram() {
    	if (this.props.stockDetail.newsDetail.symbol) {
		    return <ListProgram programType={`stockRELA`} symbol={this.props.stockDetail.newsDetail.symbol}></ListProgram>;
    	} else {
    		return '';
    	}
    }

    render() {
		  let iconClass = '';
		  let iconContent = '';
		  if (this.props.stockRate > 0 ) {
		  	iconClass = 'stock-rise-up';
		  	iconContent = <i className="iconfont">&#xe86c;</i>;
		  } else if (this.props.stockRate < 0) {
		  	iconClass = 'stock-go-down';
		  	iconContent = <i className="iconfont">&#xe60e;</i>;
		  } else {

		  }
        return (
            <section className="content-container">
		        <div  className="left-content-warpper">
		        	<div className="news-content-header">
			        	<h2>{this.props.stockDetail.newsDetail.title}</h2>
			        	<div className="news-content-header-bar">
			        		<div className="news-content-header-date">{this.props.stockDetail.newsDetail.date}</div>
			        		<ul>
			        			<li>情绪值 +21</li>
			        			<li>后市 +0.50%</li>
			        			<li>热度值 +21</li>
			        		</ul>
			        	</div>
		        	</div>
		        	<div className="news-content-body">
		        		{this.getEngBody()}
		        		{this.getCnBody()}
		        	</div>
		        	<div className="news-content-footer">
		        		<ul>
		        			<li>
		        				<div className="iconfont J_optimismIcon">&#xe677;</div>
		        				<div className="news-hope-status">202人看涨</div>
		        			</li>

		        			<li>
		        				<div className="iconfont J_pessimismIcon">&#xe7b0;</div>
		        				<div className="news-hope-status">202人看涨</div>
		        			</li>
		        		</ul>
		        	</div>
		        </div>
		        <div  className="right-content-warpper">
		        	{this.renderListProgram()}
		          	<div className="opinion-points-container">
			          	<h2>舆论指数</h2>
			            <ul>
				            <li>
				            	<div className="opinion-points-title">阿里巴巴</div>
				            	<div className="opinion-points-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-rise-up ">&#xe86c;</em>
				            	</div>
				            </li>
				            <li>
				            	<div className="opinion-points-title">苹果</div>
				            	<div className="opinion-points-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-go-down">&#xe60e;</em>
				            	</div>
				            </li>
				            <li>
				            	<div className="opinion-points-title">百度</div>
				            	<div className="opinion-points-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-rise-up ">&#xe86c;</em>
				            	</div>
				            </li>
				            <li>
				            	<div className="opinion-points-title">腾讯</div>
				            	<div className="opinion-points-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-go-down">&#xe60e;</em>
				            	</div>
				            </li>
			            </ul>
		          	</div>
		        </div>
		    </section>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

let actions = {
    getNewsDetail(newsUri) {
        return (dispatch, getState) => {
            let state = getState().stockDetail;
            if (!state.newsOnLoading) {
            	dispatch({
                    type: 'BEGIN_NEWS_LOADING'
                });
            	$.get('/stock/getNewsDetail.do')
	                .query({
	                    newsUri: newsUri
	                })
	                .then(function(response) {
	                	dispatch({
		                    type: 'FINISH_NEWS_LOADING'
		                });
	                    const body = response.body;
	                    if (body.code==0) {
	                        dispatch({
	                            type: 'GET_STOCK_NEWS_DETAIL',
	                            newsDetail: body.data
	                        });
	                    }
	                }).catch(function (err) {
	                    console.log(err)
	                    dispatch({
	                        type: 'FINISH_NEWS_LOADING'
	                    });
                });
            } else {
            	console.log('正在加载中，请稍后...');
            }
        }
    }
};

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContent);