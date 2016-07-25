const crypto = require('crypto')
const request = require("request")
const Promise = require("promise")
const querystring = require("querystring")

const BASEURL = "https://coinmate.io/api/"
function Coinmate(clientId, apiKey, privKey){
  this.clientId = clientId
  this.apiKey = apiKey
  this.privKey = privKey

}


Coinmate.prototype.sign = function(nonce){

  var message = nonce.toString() + this.clientId.toString() + this.apiKey

  return crypto.createHmac('sha256',this.privKey ).update(message).digest("hex").toUpperCase();
}

Coinmate.prototype.publicRequest = function(method, params){
  return new Promise(function(resolve, reject){
    var req = BASEURL+method+"?"+querystring.stringify(params) 
    console.log(req)
    request( req, function(err, resp, body){
      //  console.log(body)
      if (err || resp.statusCode != 200)
        return reject(err)
      else 
        return resolve(JSON.parse(body))
    })
  })

}

Coinmate.prototype.privateRequest = function(method, _params){
  var self = this
  var params = _params || {}
  var nonce = new Date().getTime()
  params.clientId = self.clientId
  params.nonce = nonce
  params.signature =  self.sign(nonce) 

  return new Promise(function(resolve, reject){
    
    console.log( querystring.stringify(params))
    request({
      method: 'POST',
      url: BASEURL+method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify(params)
    }, function (err, resp, body) {
      var content = null

      if (err || resp.statusCode != 200)
        return reject(err)
      
      content = JSON.parse(body)
      if (content.error)
        return reject(content.errorMessage)
      else 
        return resolve(content.data)

    })
  })
}

Coinmate.prototype.Ticker = function(_pair){
  var pair = _pair ? {currencyPair:_pair} : {currencyPair:"BTC_EUR"}
  return  this.publicRequest("ticker", pair)
}

Coinmate.prototype.OrderBook = function(_pair){
  var pair = _pair ? {currencyPair:_pair} : {currencyPair:"BTC_EUR"}
  return  this.privateRequest("orderBook", pair)

}


Coinmate.prototype.balances = function(){
 return this.privateRequest("balances",{}) 
}

Coinmate.prototype.TxHistory = function(options){
  options = options || {}
  return this.privateRequest("transactionHistory", options)
  
}

Coinmate.prototype.openOrders = function(_pair){
 var pair = _pair ? {currencyPair:_pair} : {currencyPair:"BTC_EUR"}
 return this.privateRequest("openOrders", pair) 
}

Coinmate.prototype.cancelOrder = function(order_id){
  var options = {orderId:order_id}
  return this.privateRequest("cancelOrder", options)
}

Coinmate.prototype.buyLimit = function(options){
 return this.privateRequest("buyLimit", options) 
}

Coinmate.prototype.sellLimit = function(options){
 return this.privateRequest("sellLimit", options) 
}

Coinmate.prototype.buyInstant = function(options){
 return this.privateRequest("buyInstant", options) 
}

Coinmate.prototype.sellInstant = function(options){
 return this.privateRequest("sellInstant", options) 
}

Coinmate.prototype.bitcoinWithdrawal = function(options){
 return this.privateRequest("bitcoinWithdrawal", options) 
}


Coinmate.prototype.bitcoinDepositAddress = function(options){
 return this.privateRequest("bitcoinDepositAddress", options) 
}


Coinmate.prototype.unconfirmedBitcoinDeposits = function(options){
 return this.privateRequest("unconfirmedBitcoinDeposits", options) 
}


Coinmate.prototype.okpayWithdrawal = function(options){
 return this.privateRequest("okpayWithdrawal", options) 
}
Coinmate.prototype.createVoucher = function(options){
 return this.privateRequest("createVoucher", options) 
}
Coinmate.prototype.redeemVoucher = function(options){
 return this.privateRequest("redeemVoucher", options) 
}


module.exports = Coinmate
