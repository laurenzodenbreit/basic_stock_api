# basic_stock_api
This API allows users to receive basic financial information on stocks, indizes and currencies

## endpoints
## stocks
**route**: 'stocks/aapl'
retrieve stock data through its symbol

### indizes
**route**: 'indizes/gspc'
retrieve stock data through its symbol

### currencies
#### currency symbols
**route**: 'currency-symbols'
returns abbreviations and symbols for national currencies

#### currency exchange rate
**route**: '/currency-exchange-rate?currency=usd&to=eur'
returns the exchange rate for two currencies

#### currency converter
**route**: '/convert-currency?currency=usd&to=eur&amount=10'
returns the exchange rate and exchanged amount for two currencies
