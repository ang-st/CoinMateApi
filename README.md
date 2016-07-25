# CoinMate Api

A promise based module for [coinmate.io](https://coinmate.io)

see the [api doc](http://docs.coinmate.apiary.io/) to see all available methods

### Quick example

```
var coinmate = require("./CoinMateApi")

var client = new coinmate(userid,apikey, privateKey)

client.balances().then(function(b){console.log(b)}).catch(function(e){console.log(e)})
{ EUR: { currency: 'EUR', balance: 0, reserved: 0, available: 0 },
     BTC: 
      { currency: 'BTC',
        balance: 0.08153,
        reserved: 0,
        available: 0.08153 } } 


```
