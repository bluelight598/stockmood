import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { Values } from 'redux-form-website-template';
// import store from './store';
// import LoginForm from '../../../components/login/loginForm/index';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import { reducer as reduxFormReducer, SubmissionError } from 'redux-form';
// import request from 'superagent';
import './index.less';

// import homeReducer from '../../reducers/system_home_reducer';
import NavBar from '../../../components/nav/index';
import loginReducer from '../../../components/login/reducer';
import Search from '../../../components/search/index';
import SearchReducer from '../../../components/search/reducer';
import StockChartPreview from '../../../components/stock_chart_preview/index';
import stockChartPreviewReducer from '../../../components/stock_chart_preview/reducer';


// import loginReducer from '../../../reducers/login_reducer.js';
// import homeSearchReducer from '../../../reducers/home_search_reducer.js';


const reducer = combineReducers({
    // form: reduxFormReducer, // mounted under "form"
    // home: homeReducer,
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

/*const showResults = (value) => {
    request
    .get('/test.do')
    .query(...value)
    .end((err, res) => {
        console.log(res);
        console.log('store')
        console.log(store)
        if (err) {
            console.log(err)
            store.dispatch({
            	type: 'setTipsInfo',
	        	status: 4
            });
            // throw new SubmissionError({ passwd: 'Wrong password', _error: 'asdasd)*((*(@#' });
        } else {
            store.dispatch({
            	type: 'setTipsInfo',
	        	status: 5
            });
            console.log('success dispatch');
        }
    });
}*/

const rootEl = document.getElementById('container');

    // <Values form="login-form" /> // for DEV test
ReactDOM.render(
  <Provider store={store}>
  	<section>
	    <section className="header-container">
	    	<NavBar barType="home"></NavBar>
	    	<div className="stock-logo-warpper">
                <div className="stock-logo-icon">lil</div>
	    		<h1 className="stock-logo-title">Stockmood</h1>
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
