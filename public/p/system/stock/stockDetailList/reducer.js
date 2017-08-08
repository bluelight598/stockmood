
/*
 * 详情页主Reducer
*/
import utils from '../../../../lib/util';

function stockDetailReducer(state = {
        newsOnLoading: false,
        // newsListArr: [],
        newsListArr: [
            // {
            //     body:"When dealing with the equity markets, investors are often tasked with trying to find stocks that are bound for glory. HHHHHHHHHHHHH\n Every investor dreams of finding those stocks that were overlooked but are poised to pick up momentum. <br>BBBBBBBBBBBBBBBBRNew investors are often instructed to set goals before starting to invest. Creating attainable, realistic goals can be a good starting point before digging into the investment trenches. After setting up goals considering financial status, objectives, timeframes and risk appetite, the next step may involve creating an actionable plan. Once the plan is in place, it may be extremely important to routinely monitor the performance of the portfolio. There are often many well crafted investment plans that for whatever reason don't seem to be working out properly. Being able to evaluate and adjust the plan based on market activity may end up being the difference between a winning or losing portfolio. Being able to adapt to the fast paced and often times tumultuous market landscape can be a gigantic benefit for long-term portfolio health.↵↵Deep diving into the technical levels for Wynn Resorts Ltd (WYNN), we note that the equity currently has a 14-day Commodity Channel Index (CCI) of -157.09. Active investors may choose to use this technical indicator as a stock evaluation tool. Used as a coincident indicator, the CCI reading above +100 would reflect strong price action which may signal an uptrend. On the flip side, a reading below -100 may signal a downtrend reflecting weak price action. Using the CCI as a leading indicator, technical analysts may use a +100 reading as an overbought signal and a -100 reading as an oversold indicator, suggesting a trend reversal.↵↵Wynn Resorts Ltd's Williams Percent Range or 14 day Williams %R currently sits at -74.84. The Williams %R oscillates in a range from 0 to -100. A reading between 0 and -20 would point to an overbought situation. A reading from -80 to -100 would signal an oversold situation. The Williams %R was developed by Larry Williams. This is a momentum indicator that is the inverse of the Fast Stochastic Oscillator.↵↵Currently, the 14-day ADX for Wynn Resorts Ltd (WYNN) is sitting at 24.91. Generally speaking, an ADX value from 0-25 would indicate an absent or weak trend. A value of 25-50 would support a strong trend. A value of 50-75 would identify a very strong trend, and a value of 75-100 would lead to an extremely strong trend. ADX is used to gauge trend strength but not trend direction. Traders often add the Plus Directional Indicator (+DI) and Minus Directional Indicator (-DI) to identify the direction of a trend.↵↵The RSI, or Relative Strength Index, is a widely used technical momentum indicator that compares price movement over time. The RSI was created by J. Welles Wilder who was striving to measure whether or not a stock was overbought or oversold. The RSI may be useful for spotting abnormal price activity and volatility. The RSI oscillates on a scale from 0 to 100. The normal reading of a stock will fall in the range of 30 to 70. A reading over 70 would indicate that the stock is overbought, and possibly overvalued. A reading under 30 may indicate that the stock is oversold, and possibly undervalued. After a recent check, the 14-day RSIfor Wynn Resorts Ltd (WYNN) is currently at 47.50, the 7-day stands at 35.37, and the 3-day is sitting at 21.29.",
            //     date:"2017-07-03",
            //     source:"concordregister.com",
            //     title:"Wynn Resorts Ltd (WYNN) Needle Moving on Volume NewsList",
            //     uri:"686157844",
            // }
        ],
        currentDay: (new Date()).Format("yyyy-MM-dd"),
        name: document.getElementById('J_data').attributes['data-name'].value,
        symbol: document.getElementById('J_data').attributes['data-symbol'].value,
        industry: document.getElementById('J_data').attributes['data-industry'].value,
        close: document.getElementById('J_data').attributes['data-close'].value,
        stockRate: document.getElementById('J_data').attributes['data-stockRate'].value,
        stockPrecent: document.getElementById('J_data').attributes['data-stockPrecent'].value
    }, action) {
    switch (action.type) {
    case 'GET_STOCK_NEWS_LIST':
        console.log(action.newsListArr)
        return Object.assign({}, state, {
            newsListArr: action.newsListArr
        });
    case 'BEGIN_NEWS_LOADING':
        return Object.assign({}, state, {
            newsOnLoading: true
        });
    case 'FINISH_NEWS_LOADING':
        return Object.assign({}, state, {
            newsOnLoading: false
        });
    case 'SET_CURRENT_DAY':
        console.log(`SET_CURRENT_DAY = ${action.currentDay}`)
        return Object.assign({}, state, {
            currentDay: action.currentDay
        });
    default:
        return state;
    }
}

export default stockDetailReducer;