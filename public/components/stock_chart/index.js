import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactEcharts from '../charts/index';
import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);
import './index.less';

class StockChart extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentDidMount() {
        this.props.getMainChart(this.props.symbol);
    }

    componentDidUpdate() {}

    chartsClickHandle(params) { // TODO 点击图表加载当天新闻
        this.props.getNews(params.name);
    }

    render() {
        const props = this.props.stockChart;
        let chartsId = 'main-chart-content';
        return (
            <section className="stock-chart-main">
                <ReactEcharts ref={chartsId} chartId={chartsId} stockInfo={props.stockInfo} chartsClickHandle={this.chartsClickHandle.bind(this)} ></ReactEcharts>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

let actions = {
    getMainChart(symbol) {
        return (dispatch, getState) => {
            let state = getState().stockChart;
            $.get('/stock/getMainChart.do')
                .query({
                    symbol: symbol
                })
                .then(function(response) {
                    const body = response.body;
                    if (body.code==0) {
                        let stockInfo = body.data || {};
                       
                        dispatch({
                            type: 'GET_STOCK_MAIN_CHART',
                            stockInfo
                        });
                    }
                }).catch(function (err) {
                    console.log(err)
                });
        }
    }

};

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockChart);