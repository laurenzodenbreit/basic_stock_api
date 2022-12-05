const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

// initialize express as new app
const app = express()

const stockSites = [  
  {
    name: 'yahoo',
    url: 'https://finance.yahoo.com',
    path: '/quote/'
  }
]

// home route
app.get('/', (req, res) => {
  // welcome page for home rout
  const welcome = {
    hello: 'user',
    endpoints: [
      {
        stockTicker: 'get metrics for stock using stock symbol',
        route: '/stocks/aapl'
      },
      {
        indexTicker: 'get metrics for index funds using symbol',
        route: '/indizes/gspc'
      },
      {
        currencySymbols: 'get all currency symbols:',
        route: '/currency-symbols'
      },
      {
        currencyExchangeRate: 'get exchange rate for two currencies',
        route: '/currency-exchange-rate?currency=usd&to=eur'
      },
      {
        convertCurrency: 'convert amount of start currency to another currency',
        route: '/convert-currency?currency=usd&to=eur&amount=10'
      }
    ]
  }
  res.json(welcome)
})

// currency symbol route 
// returns array of currency symbols
app.get('/currency-symbols', (req, res) => { 
  // arr of currency symbols stored in json file
  var currencySymbols = require('./currencySymbols.json');
  res.json(currencySymbols)
})

// exchange rate route
// returns exhange rate of two currencies
app.get('/currency-exchange-rate', (req, res) => {
    // start currency
    const fromCurrency = req.query.currency.toUpperCase();
    // end currency
    const toCurrency = req.query.to.toUpperCase();
    const CONVERT_URL = 'https://www.xe.com/de/currencyconverter/convert/?Amount=1'  + '&From=' + fromCurrency + '&To=' + toCurrency;
    // get data from converter
    axios.get(CONVERT_URL)
      .then(response => {
        // load html of site
        const html = response.data
        const $ = cheerio.load(html)
        // get result of conversion
        const result = $("p.result__BigRate-sc-1bsijpp-1").text();
        // return converted currency
        res.json({
          fromCurrency: fromCurrency,
          toCurrency: toCurrency,
          exchangeRate: result
        })
    })
})

// currency conversion route
// returns converted currency
app.get('/convert-currency', (req, res) => {
  // start currency
  const fromCurrency = req.query.currency.toUpperCase();
  // end currency
  const toCurrency = req.query.to.toUpperCase();
  // amount to convert
  const amount = req.query.amount;
  const CONVERT_URL = 'https://www.xe.com/de/currencyconverter/convert/?Amount='  + amount + '&From=' + fromCurrency + '&To=' + toCurrency;
  // get data from converter
  axios.get(CONVERT_URL)
    .then(response => {
      // load html of site
      const html = response.data
      const $ = cheerio.load(html)
      // get result of conversion
      const result = $("p.result__BigRate-sc-1bsijpp-1").text();
      // return converted currency
      res.json({
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        amount: amount,
        result: result
      })
  })
})

// index symbol route 
// gets ticker for specific index though symbol 
app.get('/indizes/:indexId', (req, res) => {
  const symbol = '^' + req.params.indexId.toUpperCase()
    // index symbol for search
  const searchSymbol = '%5E' + req.params.indexId.toUpperCase()
  // get site details from array
  const site = stockSites.filter(site => site.name == 'yahoo')[0]
  // webaddress for content scraper
  const indexAddress = site.url + site.path + searchSymbol
  axios.get(indexAddress)
    .then(response => {
      // load html of site
      const html = response.data
      const $ = cheerio.load(html)        
      // get name of index
      const name = $("h1").text()
      // get price of index
      let price = Number($("*[data-field='regularMarketPrice']").last().attr("value").replace(',', ''));
      let priceChange = Number($("*[data-field='regularMarketChange']").last().attr("value").replace(',', ''));
      let priceChangePercent = Number($("*[data-field='regularMarketChangePercent']").last().attr("value").replace(',', ''));
      // get other data from table
      let previousClose = Number($("*[data-test='PREV_CLOSE-value']").text().replace(',', ''));
      let open = Number($("*[data-test='OPEN-value']").text().replace(',', ''));
      let dayRange = $("*[data-test='DAYS_RANGE-value']").text();
      let todayLow = Number(dayRange.split(' -')[0].replace(',', ''))
      let todayHigh = Number(dayRange.split('- ')[1].replace(',', ''))
      let yearRange = $("*[data-test='FIFTY_TWO_WK_RANGE-value']").text();
      let yearLow = Number(yearRange.split(' -')[0].replace(',', ''))
      let yearHigh = Number(yearRange.split('- ')[1].replace(',', ''))
      indexRes = [
        {
          name,
          symbol,
          price,
          priceChange,
          priceChangePercent,
          more: {
            previousClose,
            open,
            todayLow,
            todayHigh,
            yearLow,
            yearHigh,
          }
        }
      ]
      // respond to user with data object
      res.json(indexRes)
    }).catch(err => console.log(err))
})


// stock symbol route
// gets ticker for specific stock through symbol
app.get('/stocks/:stockId', (req, res) => {
  // stock symbol (e.g aapl)
  const symbol = req.params.stockId.toUpperCase()
  // get site details from array
  const site = stockSites.filter(site => site.name == 'yahoo')[0]
  // webaddress for content scraper
  const stockAddress = site.url + site.path + symbol
  // axios request to webaddress
  axios.get(stockAddress)
      .then(response => {
          // load html of site
          const html = response.data
          const $ = cheerio.load(html)
          let data = {}
          // get name of stock
          const rawName = $("h1").text()
          const name = rawName.split(' (')[0]
          // get price of stock
          let price = Number($("*[data-field='regularMarketPrice']").last().attr("value").replace(',', ''));
          let priceChange = Number($("*[data-field='regularMarketChange']").last().attr("value").replace(',', ''));
          let priceChangePercent = Number($("*[data-field='regularMarketChangePercent']").last().attr("value").replace(',', ''));
          // get other data from table
          let previousClose = Number($("*[data-test='PREV_CLOSE-value']").text().replace(',', ''));
          let open = Number($("*[data-test='OPEN-value']").text().replace(',', ''));
          let dayRange = $("*[data-test='DAYS_RANGE-value']").text();
          let todayLow = Number(dayRange.split(' -')[0].replace(',', ''))
          let todayHigh = Number(dayRange.split('- ')[1].replace(',', ''))
          let yearRange = $("*[data-test='FIFTY_TWO_WK_RANGE-value']").text();
          let yearLow = Number(yearRange.split(' -')[0].replace(',', ''))
          let yearHigh = Number(yearRange.split('- ')[1].replace(',', ''))
          let marketCap = $("*[data-test='MARKET_CAP-value']").text();
          let earningsDate = $("*[data-test='EARNINGS_DATE-value']").text();
          let oneYearTarget = Number($("*[data-test='ONE_YEAR_TARGET_PRICE-value']").text().replace(',', ''));
          // push results to data object
          data = [
            {
              name,
              symbol,
              price,
              priceChange,
              priceChangePercent,
              more: {
                previousClose: previousClose,
                open,
                todayLow,
                todayHigh,
                yearLow,
                yearHigh,
                marketCap,
                earningsDate,
                oneYearTarget
              }
            }
          ]
          // respond to user with data array
          res.json(data)
      }).catch(err => console.log(err))
})

// listen to requests
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

module.exports = app;
