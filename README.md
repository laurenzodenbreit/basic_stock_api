# basic_stock_api
This API allows users to receive basic financial information on stocks, indizes and currencies

## endpoints
### stocks
**route**: 'stocks/:symbol'
retrieves stock data through its symbol
example: '/stocks/aapl'

### indizes
**route**: 'indizes/gspc'
retrieves index fund data through its symbol
example: '/indizes/gspc'

### currencies
#### currency symbols
**route**: 'currency-symbols'
returns abbreviations and symbols for national currencies
example: '/currency-symbols'

#### currency exchange rate
**route**: '/currency-exchange-rate?currency=currency1&to=currency2'
returns the exchange rate for two currencies
example: '/currency-exchange-rate?currency=usd&to=eur'

#### currency converter
**route**: '/convert-currency?currency=currency1&to=currency2&amount=exchangeAmount'
returns the exchange rate and exchanged amount for two currencies
example: '/convert-currency?currency=usd&to=eur&amount=10'
