// var express = require('express');
// var path = require('path');
// var app = express();
// app.use(express.static(path.join(__dirname, 'dist')));
// app.listen(80);
const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const resolve = file => path.resolve(__dirname, file)
const app = express()
app.use(favicon(resolve('./dist/favicon.ico')))
app.use('/dist', express.static(resolve('./dist')))
app.use('/STATIC', express.static(resolve('./static')))
app.use('/cron', function (req, res) {
  // const html = fs.readFileSync(resolve('./dist/' + 'static/index.html'), 'utf-8')
  const html = fs.readFileSync(resolve('./static/Cron/index.html'), 'utf-8')
  res.send(html)
});
app.use('/', function (req, res) {
  const html = fs.readFileSync(resolve('./dist/' + 'index.html'), 'utf-8')
  res.send(html)
})

app.listen(80);
