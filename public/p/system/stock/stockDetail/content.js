import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainStockChart from '../../../../components/stock_chart/index';
import NewsList from '../../../../components/newsList/index';

import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);

class ContentContainer extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentWillMount() {}

    componentDidMount() {}

    componentDidUpdate() {}

    componentWillUpdate() {}

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
		          <div className="stock-chart-container">
		          	<h2 className="stock-chart-title">{this.props.stockDetail.name}</h2>
		          	<h3 className="stock-chart-desc">{this.props.stockDetail.industry}</h3>
		          	<div className="stock-chart-points">
		          		<strong>{this.props.stockDetail.close}</strong>
		          		<span className={`iconfont ${iconClass}`}>{iconContent}<em>{this.props.stockDetail.stockRate}&nbsp;&nbsp;{this.props.stockDetail.stockPrecent}</em></span>
		          	</div>
		          	<MainStockChart symbol={this.props.stockDetail.symbol} getNews={this.props.getNews}></MainStockChart>
		          </div>
		          <NewsList {...this.props.stockDetail} getNews={this.props.getNews}></NewsList>
		        </div>
		        <div  className="right-content-warpper">
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
		          <div className="opinion-hot-container">
		          	<h2 className="opinion-hot-title">热门舆论</h2>
		          	<ul>
			            <li>
			            	<div className="opinion-hot-avatar">
			            		<img />
			            	</div>
			            	<div className="opinion-hot-info">
			            		<h3>Champions<span>@somebody&nbsp;6h</span></h3>
			            		<p>If you decorate a static class property, you will get a descriptor with an initializer property. However whereas with Babel 5 this could be re-executed multiple times with potentially differing results, decorators-legacy will precompute the value and return an initializer that will return that value. e.g.</p>
			            	</div>
			            </li>
			            <li>
			            	<div className="opinion-hot-avatar">
			            		<img />
			            	</div>
			            	<div className="opinion-hot-info">
			            		<h3>Champions<span>@somebody&nbsp;6h</span></h3>
			            		<p>If you decorate a static class y will precompute the value and return an initializer that will return that value. e.g.</p>
			            	</div>
			            </li>
			            <li>
			            	<div className="opinion-hot-avatar">
			            		<img />
			            	</div>
			            	<div className="opinion-hot-info">
			            		<h3>Champions<span>@somebody&nbsp;6h</span></h3>
			            		<p>If you decoratt will return that value. e.g.</p>
			            	</div>
			            </li>
			            <li>
			            	<div className="opinion-hot-avatar">
			            		<img />
			            	</div>
			            	<div className="opinion-hot-info">
			            		<h3>Champions<span>@somebody&nbsp;6h</span></h3>
			            		<p>If you decorate a static class property, you will get a de whereas with Babel 5 this could be re-executed multiple times with potentially differing results, decoe value and return an initit value. e.g.</p>
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
    getNews(dateTime) {
	  	let symbol = document.getElementById('J_data').attributes['data-symbol'].value;
        return (dispatch, getState) => {
            let state = getState().stockDetail;
            if (!state.newsOnLoading) {
            	dispatch({
	                type: 'SET_CURRENT_DAY',
	                currentDay: dateTime,
	            });
            	dispatch({
                    type: 'BEGIN_NEWS_LOADING'
                });
            	$.get('/stock/getNewsList.do')
	                .query({
	                    time: dateTime,
	                    symbol: symbol
	                })
	                .then(function(response) {
	                	dispatch({
		                    type: 'FINISH_NEWS_LOADING'
		                });
	                    const body = response.body;
	                    if (body.code==0) {
	                        let newsListArr = body.data || {};
	                        dispatch({
	                            type: 'GET_STOCK_NEWS_LIST',
	                            newsListArr
	                        });
	                    }
	                }).catch(function (err) {
	                    console.log(err)
	                    dispatch({
	                        type: 'FINISH_NEWS_LOADING'
	                    });
                });
            }
        }
    }
};

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);