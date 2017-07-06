import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchInput from './searchInput';
import SearchList from './searchList';
import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);
import './index.less';

class Searcher extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <section className={`search-container search-${this.props.searchType}`}>
                <SearchInput {...this.props}></SearchInput>
                <SearchList {...this.props.search} clickStockListItem={this.props.clickStockListItem}></SearchList>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

let actions = {
    searchInputFocus(e) {
        return ({
            type: 'SHOW_SEARCH_LIST'
        });
    },
    searchInputBlur(e) {
        return (dispatch, getState) => {
            setTimeout(() => { // 解决 click stocklist item 时，由于先触发 失焦 而导致 元素被隐藏，click无效的问题
                dispatch({
                    type: 'HIDE_SEARCH_LIST'
                });
            }, 200);
        };
    },
    clickStockListItem(i) {
        return (dispatch, getState) => {
            let state = getState().search;
            let currentValue = state.listArr[i].name;
            document.querySelector('#search-inputer').value = currentValue;
            dispatch({
                type: 'CLICK_STOCK_LIST_ITEM',
                currentItemId: i,
                currentValue: currentValue
            });
        }
    },
    searchInputChange(e) {
        return (dispatch, getState) => {
            let state = getState().search;
            if (!state.isOnLoading) {
                dispatch({
                    type: 'SHOW_LOADING'
                });
                dispatch({
                    type: 'SHOW_SEARCH_LIST'
                });
                $.get('/stock/getStockListAsLike.do')
                    .query({
                        cv: encodeURIComponent(e.target.value)
                    })
                    .then(function(response) {
                        dispatch({
                            type: 'HIDE_LOADING'
                        });
                        const body = response.body;
                        // console.log(body)
                        if (body.code==0) {
                            let listArr = body.data || [];
                            dispatch({
                                type: 'HIDE_LOADING'
                            });
                            dispatch({
                                type: 'GET_STOCK_LIST',
                                listArr
                            });
                        }
                    }).catch(function (err) {
                        console.log(err)
                        dispatch({
                            type: 'HIDE_LOADING'
                        });
                    });
            } else {
                console.log('is isOnLoading ,,,, do nothing....')
            }
        }
    },
    searchInputKeyUp(e)  {
        e.persist(); // 保持事件不被set为null，持久化
        return (dispatch, getState) => {
            let state = getState().search;
            if (e.keyCode == 38) {
                dispatch({
                    type: 'PRESS_UP_KEY'
                });
            } else if (e.keyCode == 40) {
                dispatch({
                    type: 'PRESS_DOWN_KEY'
                });
            } else if (e.keyCode == 13) {
                if (state.searchListStatus != 'J_hide' && state.currentItemId != -1) { // 当前激活了下拉联想列表 && 当前选中了一项，按下回车，input的value设置为选中条目
                    e.target.value = state.currentValue;
                } else {
                    $.get('/stock/goToStockDetail.do')
                        .query({
                            cv: encodeURIComponent(e.target.value)
                        })
                        .then(function(response) {
                            const body = response.body;
                            console.log(body)
                            if (body.code==0) {
                                var data = body.data;
                                if (data) {
                                    console.log(`targetSymbol = ${data.maxCompare.symbol}`)
                                    window.location.href = `/stockDetail/${data.maxCompare.symbol}`;
                                }
                            } 
                        }).catch(function (err) {
                            console.log(err)
                        });
                }
                setTimeout(() => { // 解决 click stocklist item 时，由于先触发 失焦 而导致 元素被隐藏，click无效的问题
                    dispatch({
                        type: 'HIDE_SEARCH_LIST'
                    });
                }, 200);
            }
        }
    }

};

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Searcher);