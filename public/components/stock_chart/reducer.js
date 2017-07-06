/*
 * 股票图表预览列表Reducer
*/

function stockChartReducer(state = {
        // isOnLoading: false,
        stockInfo: {}
    }, action) {
    switch (action.type) {
    case 'GET_STOCK_MAIN_CHART':
        return Object.assign({}, state, {
            stockInfo: action.stockInfo
        });
    // case 'SHOW_LOADING':
    //     return state;
    // case 'HIDE_LOADING':
    //     return state;
    default:
        return state;
    }
}

export default stockChartReducer;