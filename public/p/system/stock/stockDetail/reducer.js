
/*
 * 详情页主Reducer
*/
import utils from '../../../../lib/util';

function stockDetailReducer(state = {
        newsOnLoading: false,
        newsListArr: [],
        currentDay: (new Date()).Format("yyyy-MM-dd"),
        name: document.getElementById('J_data').attributes['data-name'].value,
        symbol: document.getElementById('J_data').attributes['data-symbol'].value,
        industry: document.getElementById('J_data').attributes['data-industry'].value,
        close: document.getElementById('J_data').attributes['data-close'].value,
        stockRate: document.getElementById('J_data').attributes['data-stockRate'].value,
        stockPrecent: document.getElementById('J_data').attributes['data-stockPrecent'].value
    }, action) {
    switch (action.type) {
    case 'GET_STOCK_NEWS_LIST':
        return Object.assign({}, state, {
            newsListArr: action.newsListArr
        });
    case 'BEGIN_NEWS_LOADING':
        return Object.assign({}, state, {
            newsOnLoading: true
        });
    case 'FINISH_NEWS_LOADING':
        return Object.assign({}, state, {
            newsOnLoading: false
        });
    case 'SET_CURRENT_DAY':
        return Object.assign({}, state, {
            currentDay: action.currentDay
        });
    default:
        return state;
    }
}

export default stockDetailReducer;