import React from 'react';
// import { getUrlQuery } from '../../../lib/util';

class SearchList extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    componentDidMount() {
        // const urlQuery = getUrlQuery('status');
        // this.props.setTipsInfo(urlQuery.status);
    }

    componentDidUpdate() {}

    componentWillUpdate() {}

    getLiItems() {
        var items = [];
        for (let i = 0; i < this.props.listArr.length; i++) {
        	let item = this.props.listArr[i];
        	items.push(
        		<li onClick={this.props.clickStockListItem.bind(this,i)} className={(this.props.currentItemId == i && this.props.currentItemId >= 0) ? 'J_selected' : 'J_notSelected'} key={`search-list-item-${i}`}>
					<strong>{item.name}</strong><span>{item.symbol}</span>
    			</li>
        	);
        }
        return items;
    }

    render() {
        return (
            <section className={`search-list-container ${this.props.searchListStatus}`}>
        		<ul>
        			{this.getLiItems()}
        		</ul>
        	</section>
        );
    }
}

export default SearchList;