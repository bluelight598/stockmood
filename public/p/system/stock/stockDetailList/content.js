import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainStockChart from '../../../../components/stock_chart/index';
import NewsList from '../../../../components/newsList/index';
import ListProgram from '../../../../components/listProgram/index';

import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);

class ContentContainer extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    // static defaultProps = {
    //     newsListArr: [
    //         {
    //             body:"When dealing with the equity markets, investors are often tasked with trying to find stocks that are bound for glory.\n Every investor dreams of finding those stocks that were overlooked but are poised to pick up momentum. New investors are often instructed to set goals before starting to invest. Creating attainable, realistic goals can be a good starting point before digging into the investment trenches. After setting up goals considering financial status, objectives, timeframes and risk appetite, the next step may involve creating an actionable plan. Once the plan is in place, it may be extremely important to routinely monitor the performance of the portfolio. There are often many well crafted investment plans that for whatever reason don't seem to be working out properly. Being able to evaluate and adjust the plan based on market activity may end up being the difference between a winning or losing portfolio. Being able to adapt to the fast paced and often times tumultuous market landscape can be a gigantic benefit for long-term portfolio health.↵↵Deep diving into the technical levels for Wynn Resorts Ltd (WYNN), we note that the equity currently has a 14-day Commodity Channel Index (CCI) of -157.09. Active investors may choose to use this technical indicator as a stock evaluation tool. Used as a coincident indicator, the CCI reading above +100 would reflect strong price action which may signal an uptrend. On the flip side, a reading below -100 may signal a downtrend reflecting weak price action. Using the CCI as a leading indicator, technical analysts may use a +100 reading as an overbought signal and a -100 reading as an oversold indicator, suggesting a trend reversal.↵↵Wynn Resorts Ltd's Williams Percent Range or 14 day Williams %R currently sits at -74.84. The Williams %R oscillates in a range from 0 to -100. A reading between 0 and -20 would point to an overbought situation. A reading from -80 to -100 would signal an oversold situation. The Williams %R was developed by Larry Williams. This is a momentum indicator that is the inverse of the Fast Stochastic Oscillator.↵↵Currently, the 14-day ADX for Wynn Resorts Ltd (WYNN) is sitting at 24.91. Generally speaking, an ADX value from 0-25 would indicate an absent or weak trend. A value of 25-50 would support a strong trend. A value of 50-75 would identify a very strong trend, and a value of 75-100 would lead to an extremely strong trend. ADX is used to gauge trend strength but not trend direction. Traders often add the Plus Directional Indicator (+DI) and Minus Directional Indicator (-DI) to identify the direction of a trend.↵↵The RSI, or Relative Strength Index, is a widely used technical momentum indicator that compares price movement over time. The RSI was created by J. Welles Wilder who was striving to measure whether or not a stock was overbought or oversold. The RSI may be useful for spotting abnormal price activity and volatility. The RSI oscillates on a scale from 0 to 100. The normal reading of a stock will fall in the range of 30 to 70. A reading over 70 would indicate that the stock is overbought, and possibly overvalued. A reading under 30 may indicate that the stock is oversold, and possibly undervalued. After a recent check, the 14-day RSIfor Wynn Resorts Ltd (WYNN) is currently at 47.50, the 7-day stands at 35.37, and the 3-day is sitting at 21.29.",
    //             date:"2017-07-03",
    //             source:"concordregister.com",
    //             title:"Wynn Resorts Ltd (WYNN) Needle Moving on Volume",
    //             uri:"686157844",
    //         }
    //     ]
    // }

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
		        	<ListProgram programType={`stockRELA`} symbol={this.props.stockDetail.symbol}></ListProgram>
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

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);