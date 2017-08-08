
/*
 * 详情页主Reducer
*/
import utils from '../../../../lib/util';

function stockDetailReducer(state = {
        newsOnLoading: false,
        // newsListArr: [],
        newsDetail: false
    }, action) {
    switch (action.type) {
    case 'GET_STOCK_NEWS_DETAIL':
        return Object.assign({}, state, {
            newsDetail: action.newsDetail
        });
    case 'BEGIN_NEWS_LOADING':
        return Object.assign({}, state, {
            newsOnLoading: true
        });
    case 'FINISH_NEWS_LOADING':
        return Object.assign({}, state, {
            newsOnLoading: false
        });
    default:
        return state;
    }
}

export default stockDetailReducer;