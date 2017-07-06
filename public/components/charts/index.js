import echarts from 'echarts';

import React from 'react';

class ReactEcharts extends React.Component {
    constructor(props) { // 构造函数
        super(props);
    }

    static defaultProps = {
        chartsId: '',
        stockInfo: {}
    }

    componentDidMount() {
        if (!this.echartsIns && this.props.stockInfo.option) {
            this.echartsIns = echarts.init(document.getElementById(this.props.chartId));
            this.echartsIns.setOption(this.props.stockInfo.option);
            window.addEventListener('resize', this.onWindowResize.bind(this))
            if (this.props.chartsClickHandle) {
                this.echartsIns.on('click', this.props.chartsClickHandle.bind(this));
            }
        }
    }

    onWindowResize(e) {
        this.echartsIns.resize();
    }

    componentDidUpdate() {
        if (!this.echartsIns && this.props.stockInfo.option) {
            this.echartsIns = echarts.init(document.getElementById(this.props.chartId));
            this.echartsIns.setOption(this.props.stockInfo.option);
            window.addEventListener('resize', this.onWindowResize.bind(this))
            if (this.props.chartsClickHandle) {
                this.echartsIns.on('click', this.props.chartsClickHandle.bind(this));
            }
        }
    }

    componentWillUpdate() {}

    render() {
        let className = `J_mainChart ${this.props.className || ''}`
        return (
            <div className={className} id={this.props.chartId}></div>
        );
    }
}

export default ReactEcharts;