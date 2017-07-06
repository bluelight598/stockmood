import React from 'react';
import './index.less';

class NewsList extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    // static defaultProps = {}

    componentDidMount() {
        this.props.getNews(this.props.currentDay);
    }

    componentDidUpdate() {}

    getNewsListItems() {
    	let listItems = [];
        if (this.props.newsOnLoading) {
            listItems.push(
                <li className="stock-news-list-item empty-list-item" key={`list-item-onloading-${new Date().getTime()}`}>
                    <p className="stock-news-list-item-content">正在加载中...</p>
                </li>
            );
        } else {
            if (this.props.newsListArr.length>0) {
            	for (let i=0;i<this.props.newsListArr.length;i++) {
            		listItems.push(
            			<li className="stock-news-list-item" key={`list-item-${i}-${new Date().getTime()}`}>
            				<h2 className="stock-news-list-item-title">{this.props.newsListArr[i].title}</h2>
            				<p className="stock-news-list-item-content">{this.props.newsListArr[i].body}</p>
            				<div className="stock-news-item-btns">
            					<ul className="stock-news-item-tags">
            						<li>
            							<span>情绪值</span>
            							<em>+21</em>
            						</li>
            						<li>
            							<span>后市</span>
            							<em>+0.50%</em>
            						</li>
            						<li>
            							<span>热度值</span>
            							<em>+21</em>
            						</li>
            					</ul>
            					<ul className="stock-news-item-vote">
            						<li className="J_hopeful">
            							<em className="iconfont">&#xe608;</em>
            							<span>看涨</span>
            						</li>
            						<li className="J_pessimism">
            							<em className="iconfont">&#xe601;</em>
            							<span>看跌</span>
            						</li>
            					</ul>
            				</div>
            			</li>
            		);
            	}
            } else {
                listItems.push(
                    <li className="stock-news-list-item empty-list-item" key={`list-item-empty-${new Date().getTime()}`}>
                        <p className="stock-news-list-item-content">{this.props.currentDay}&nbsp;暂时没有相关新闻</p>
                    </li>
                );
            }
        }
    	return listItems;
    }

    render() {
        return (
            <div className="stock-news-container">
            	<div className="stock-news-header">
            		<h3 className="stock-news-header-title">相关新闻</h3>
            	</div>
            	<ul className="stock-news-list-content">
            		{this.getNewsListItems()}
            	</ul>
		    </div>
        );
    }
}
export default NewsList;