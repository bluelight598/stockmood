import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import './index.less';
import NavBar from '../../../../components/nav/index';
import LoginBar from '../../../../components/login/index';
import loginReducer from '../../../../components/login/reducer';
import SearchReducer from '../../../../components/search/reducer';
import stockChartReducer from '../../../../components/stock_chart/reducer';
import stockDetailReducer from './reducer';
import DetailContent from './content';
import listProgramReducer from '../../../../components/listProgram/reducer';


const reducer = combineReducers({
    stockDetail: stockDetailReducer,
    stockChart: stockChartReducer,
    search: SearchReducer,
    listProgram: listProgramReducer,
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
ReactDOM.render(
  <Provider store={store}>
    <section>
      <LoginBar></LoginBar>
      <section className="header-container">
        <NavBar barType="default"></NavBar>
      </section>
      <DetailContent></DetailContent>
    </section>
  </Provider>,
  rootEl,
);
