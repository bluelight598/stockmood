import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import $ from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify($);
import './index.less';

class ListProgram extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentDidMount() {
    	this.props.getStockRELA(this.props.symbol);
    }

    componentDidUpdate() {}

    getListRELA() {
    	let listRELA = [];
    	if (this.props.listProgram.stockRELA.length) {
	    	this.props.listProgram.stockRELA.forEach((el,index)=>{
	    		listRELA.push(
	    			<li key={`${index}_${el.company2}`}>
					    <a href={`/stockDetailList/${el.company2}`}>
			            	<div className="list-program-title">{el.company2}</div>
			            	<div className="list-program-info ">
			            		<span>{`${(el.correlation * 10000).toString().split('.')[0]/100}%`}</span>
			            	</div>
					    </a>
		            </li>
		        );
	    	});
    	} else {
    		listRELA.push(
    			<li key="list_program_rela_empty"><a href="javascript:void(0);">暂时没有相关股票</a></li>
		    );
    	}
    	return listRELA;
    }

    getListProgram() {
    	if (this.props.programType == 'stockRELA') { // 股票相关性列表
    		return (
    				<div className="list-program-container">
			          	<h2>股票相关性</h2>
			            <ul>
				            {this.getListRELA()}
			            </ul>
			        </div>
    			)
    	} else if (this.props.programType === 'opinionPoints') { // 舆论指数
    		return (
    				<div className="list-program-container">
			          	<h2>舆论指数</h2>
			            <ul>
				            <li>
				            	<div className="list-program-title">阿里巴巴</div>
				            	<div className="list-program-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-rise-up ">&#xe86c;</em>
				            	</div>
				            </li>
				            <li>
				            	<div className="list-program-title">苹果</div>
				            	<div className="list-program-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-go-down">&#xe60e;</em>
				            	</div>
				            </li>
				            <li>
				            	<div className="list-program-title">百度</div>
				            	<div className="list-program-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-rise-up ">&#xe86c;</em>
				            	</div>
				            </li>
				            <li>
				            	<div className="list-program-title">腾讯</div>
				            	<div className="list-program-info ">
				            		<span>32452</span>
				            		<em className="iconfont stock-go-down">&#xe60e;</em>
				            	</div>
				            </li>
			            </ul>
			        </div>
    			)
    	} else {
    		return <div>empty</div>
    	}
    }

    render() {
    	console.log(this.props.symbol)
        return (
            this.getListProgram()
        );
    }
}
// export default ListProgram;
function mapStateToProps(state) {
    return state;
}

let actions = {
	getStockRELA(symbol) {
        return (dispatch, getState) => {
            $.get('/stock/getStockRELA.do')
            	.query({
            		symbol: symbol
            	})
                .then(function(response) {
                    const body = response.body;
                    console.log(body)
                    if (body.code == 0) {
                        dispatch({
                            type: 'GET_STOCK_RELA',
                            stockRELA: body.data
                        });
                    } else {
                    	/*dispatch({
		                    type: 'SHOW_LOGIN_BAR_MSG',
		                    loginBarMSG: body.message
		                });*/
		                console.log('获取登录信息失败');
                    }
                }).catch(function(err) {
                	console.log(err)
            });

        }
    },
    
};

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListProgram);