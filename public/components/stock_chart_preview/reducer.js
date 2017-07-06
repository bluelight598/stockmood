/*
 * 股票图表预览列表Reducer
*/

function stockChartPreviewReducer(state = {
        isOnLoading: false,
        stockList: []
    }, action) {
    switch (action.type) {
    case 'GET_STOCK_CHART_PREVIEW':
        return Object.assign({}, state, {
            stockList: action.stockList
        });
    case 'SHOW_LOADING':
        return state;
    case 'HIDE_LOADING':
        return state;
    default:
        return state;
    }
}

export default stockChartPreviewReducer;