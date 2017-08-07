import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import NavBar from '../../../components/nav/index';
import LoginBar from '../../../components/login/index';
import loginReducer from '../../../components/login/reducer';
import Search from '../../../components/search/index';
import SearchReducer from '../../../components/search/reducer';
import StockChartPreview from '../../../components/stock_chart_preview/index';
import stockChartPreviewReducer from '../../../components/stock_chart_preview/reducer';
import './index.less';

const reducer = combineReducers({
    chartlist: stockChartPreviewReducer,
    search: SearchReducer,
    login: loginReducer
});

const composeOption = [applyMiddleware(thunk)];
if (window.__REDUX_DEVTOOLS_EXTENSION__) { // 如果安装了chrome开发调试插件，则加载
    composeOption.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}
const store = createStore(
    reducer,
    compose(...composeOption) //插件调试，未安装会报错
);

const rootEl = document.getElementById('container');

                // <div className="stock-logo-icon">lil</div>
                // <h1 className="stock-logo-title">Stockmood</h1>
ReactDOM.render(
  <Provider store={store}>
    <section>
        <LoginBar></LoginBar>
        <section className="header-container">
            <NavBar barType="home"></NavBar>
            <div className="stock-logo-warpper">
                <div className="nav-logo-svg"></div>
            </div>
            <Search searchType="home"></Search>
        </section>
        <section className="stock-list-container">
            <StockChartPreview></StockChartPreview>
        </section>
    </section>
  </Provider>,
  rootEl,
);
