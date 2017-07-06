/*
 * 首页搜索区Reducer
*/

function searchReducer(state = {
        currentItemId: -1,
        searchListStatus: 'J_hide',
        currentValue: '',
        isOnLoading: false,
        listArr: []
    }, action) {
    let currentItemId = state.currentItemId;
    let currentValue = '';
    switch (action.type) {
    case 'PRESS_UP_KEY': // input被Focus时，按下方向键上
        if (currentItemId - 1 >= 0) {
        	currentItemId = currentItemId - 1;
        } else {
        	currentItemId = state.listArr.length - 1;
        }
        currentValue = state.listArr[currentItemId].name;
        return Object.assign({},state,{
			currentItemId: currentItemId,
            currentValue: currentValue
		});
    case 'PRESS_DOWN_KEY': // input被Focus时，按下方向键下
        if (currentItemId + 1 < state.listArr.length) {
        	currentItemId = currentItemId + 1;
        } else {
        	currentItemId = 0;
        }
        currentValue = state.listArr[currentItemId].name;
        return Object.assign({},state,{
            currentItemId: currentItemId,
            currentValue: currentValue
        });
    case 'CLICK_STOCK_LIST_ITEM': // 鼠标选择指定stocklist条目
    	return Object.assign({},state,{
			currentItemId: action.currentItemId,
            currentValue: action.currentValue
		});
    case 'SHOW_SEARCH_LIST': // 显示搜索联想列表
    	return Object.assign({},state,{
        	searchListStatus: '',
    	});
    case 'HIDE_SEARCH_LIST': // 显示搜索联想列表
		return Object.assign({},state,{
        	searchListStatus: 'J_hide',
        	currentItemId: -1
    	});
    case 'GET_STOCK_LIST': // 根据股票代码，模糊查询
    	return Object.assign({},state,{
			listArr: action.listArr
		});
    case 'SHOW_LOADING':
    	return Object.assign({},state,{
        	isOnLoading: true,
    	});
   	case 'HIDE_LOADING':
    	return Object.assign({},state,{
        	isOnLoading: false,
    	});
    case 'SEARCH_INPUT_ON_CHANGE':
    	return Object.assign({},state);
    default:
        return state;
    }
}

export default searchReducer;