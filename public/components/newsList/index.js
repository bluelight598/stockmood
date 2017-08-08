import React from 'react';
import './index.less';
import util from '../../lib/util.js';

class NewsList extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentDidMount() {
        this.props.getNews(this.props.currentDay);
    }

    getNextDayNews() {
        let today = new Date().Format('yyyy-MM-dd');
        let targetDate = new Date(new Date(this.props.currentDay).getTime() + 24*60*60*1000).Format('yyyy-MM-dd');
        if (new Date(today)>=new Date(targetDate)) { // 只爬取今天以前的数据
            this.props.getNews(targetDate);
        } else {
            console.log('只爬取今天以前的数据')
        }
    }

    getPreviousDayNews() {
        let lastMonth = new Date(new Date().getTime() - 24*60*60*1000*30).Format('yyyy-MM-dd');
        let targetDate = new Date(new Date(this.props.currentDay).getTime() - 24*60*60*1000).Format('yyyy-MM-dd');
        this.props.getNews(targetDate);
        if (new Date(targetDate)>=new Date(lastMonth)) { // 只爬取31天内的数据
            this.props.getNews(targetDate);
        } else {
            console.log('只爬取31天内的数据')
        }
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
            				<h2 className="stock-news-list-item-title"><a href={`/stockDetail?uri=${this.props.newsListArr[i].uri}`}>{this.props.newsListArr[i].title}</a></h2>
            				<pre className="stock-news-list-item-content">{`${this.props.newsListArr[i].body_eng.slice(0,250)}...`}</pre>
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
        let hasNextClass = this.props.currentDay === (new Date()).Format('yyyy-MM-dd') ? 'hasNoNext' : '';
        let hasPrevClass = this.props.currentDay === new Date(new Date().getTime() - 24*60*60*1000*30).Format('yyyy-MM-dd') ? 'hasNoNext' : '';
        return (
            <div className="stock-news-container">
            	<div className="stock-news-header">
            		<h3 className="stock-news-header-title">相关新闻</h3>
                    <ul className="stock-news-date-btns">
                        <li className={`J_previousDayNews`}><a href="javascript:void(0);" className={`iconfont ${hasPrevClass}`} onClick={this.getPreviousDayNews.bind(this)}>&#xe649;</a></li>
                        <li>{this.props.currentDay}</li>
                        <li className={`J_nextDayNews`}><a className={`iconfont ${hasNextClass}`} href="javascript:void(0);" onClick={this.getNextDayNews.bind(this)}>&#xe647;</a></li>
                    </ul>
            	</div>
            	<ul className="stock-news-list-content">
            		{this.getNewsListItems()}
            	</ul>
		    </div>
        );
    }
}
export default NewsList;