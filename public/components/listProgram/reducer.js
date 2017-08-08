/*
 * 股票图表预览列表Reducer
*/

function stockChartReducer(state = {
        // isOnLoading: false,
        opinionPoints: [],
        stockRELA: []
    }, action) {
    switch (action.type) {
    case 'GET_STOCK_RELA':
        return Object.assign({}, state, {
            stockRELA: action.stockRELA
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