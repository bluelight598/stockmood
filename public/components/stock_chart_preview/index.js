import React from 'react';

import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';
// import HomeSearchInput from './homeSearchInput';
import StockChartPreviewList from './stockChartPreviewList';
import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);

import './index.less';

// import { getUrlQuery } from '../../../lib/util';

class StockChartPreview extends React.Component {
    constructor(props) { // 构造函数
        super(props);

    }

    componentDidMount() {
        // const urlQuery = getUrlQuery('status');
        // this.props.setTipsInfo(urlQuery.status);
    }

    componentDidUpdate() {}

    render() {
        const props = this.props.chartlist;
        return (
            <section className="stock-chart-preview-container">
                <StockChartPreviewList {...props} getStockChartPreview={this.props.getStockChartPreview}></StockChartPreviewList>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

let actions = {
    getStockChartPreview(e) {
        return (dispatch, getState) => {
            let state = getState().chartlist;
            if (!state.isOnLoading) {
                dispatch({
                    type: 'SHOW_LOADING'
                });
                $.get('/stock/getStockChartPreview.do')
                    .query({
                        // cv: encodeURIComponent(e.target.value)
                    })
                    .then(function(response) {
                        dispatch({
                            type: 'HIDE_LOADING'
                        });
                        const body = response.body;
                        console.log(body)
                        if (body.code==0) {
                            let stockList = body.data.stock || [];
                            dispatch({
                                type: 'HIDE_LOADING'
                            });
                           
                            dispatch({
                                type: 'GET_STOCK_CHART_PREVIEW',
                                stockList
                            });
                        }
                    }).catch(function (err) {
                        console.log(err)
                        dispatch({
                            type: 'HIDE_LOADING'
                        });
                    });
            } else {
                console.log('getStockChartPreview is isOnLoading ,,,, do nothing....')
            }
        }
    }

};

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockChartPreview);