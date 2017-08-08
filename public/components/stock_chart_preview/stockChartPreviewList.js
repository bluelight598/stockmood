import React from 'react';
import ReactEcharts from '../charts/index';

class StockChartPreviewList extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    static defaultProps = {
        isOnLoading: false,
        stockList: []
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.props.getStockChartPreview();
    }

    componentDidUpdate() {}

    componentWillUpdate() {}

    getStockChartPreviewList() {
        var previewList = [];
        for (let i = 0; i < this.props.stockList.length; i++) {
            let chartsId = `J_chartPreview_${this.props.stockList[i].symbol}`;
            let stockInfo = this.props.stockList[i];
            var riseUpStateClass =  stockInfo.rate.slice(0,1) === '+' ? 'J_riseup' : '';
            previewList.push(
                <li  key={chartsId}>
                    <a href={`/stockDetailList/${stockInfo.symbol}`}>
                        <ReactEcharts ref={chartsId} chartId={chartsId} stockInfo={stockInfo} className={'J_chartPreview'} ></ReactEcharts>
                        <div className={`stock-detail ${riseUpStateClass}`}>
                            <strong className="stock-detail-name">{stockInfo.symbol}</strong>
                            <strong className="stock-detail-price">{stockInfo.price}</strong>
                            <span className="stock-detail-rate">{stockInfo.rate}</span>
                        </div>
                    </a>
                </li>
            );
        }
        return previewList;
    }

    render() {
        return (
            <section className="stock-chart-preview-list-container">
                <ul className="clearfix">
                    {this.getStockChartPreviewList()}
                    <li className="J_addMyFav iconfont"></li>
                </ul>
            </section>
        );
    }
}

export default StockChartPreviewList;