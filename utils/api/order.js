const fetch = require('./fetch.js').fetch

exports.getOrderList = params => fetch('/OrderManager/getOrderList', 'GET', params)

exports.createOrder = params => fetch('/OrderManager/createOrder', 'POST', params)

exports.deleteOrder = params => fetch('/OrderManager/deleteOrder', 'POST', params)

exports.payOrder = params => fetch('/OrderManager/payOrder', 'POST', params)

exports.getOrderDetail = params => fetch('/OrderManager/getOrderDetail', 'GET', params)
