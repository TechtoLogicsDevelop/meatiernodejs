const express = require('express');
const app = express();

const admin = require('./admin/controller');
const user = require('./user/controller');
const product = require('./product/controller');
const review = require('./review/controller');
const vendor = require('./vendors/controller');
const cart = require('./cart/controller');


app.use('/admin', admin);
app.use('/user', user);
app.use('/product', product);
app.use('/review', review);
app.use('/vendor', vendor);
app.use('/cart', cart);

module.exports = app;