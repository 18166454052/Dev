const fs = require('fs')
const path = require('path')
const express = require('express')
var bodyParser = require('body-parser');
const favicon = require('serve-favicon')
const resolve = file => path.resolve(__dirname, file)
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(resolve('./dist/favicon.ico')))
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});
app.use('/regist', function(req, res) {
	console.log(req.body);
  var data=JSON.stringify(req.body)+'\r\n';
  fs.appendFile(path.join(__dirname, 'registInfo.txt'), data, 'utf-8', function(err) {
   if(err) {
			res.json({data:'error'});
    }
       else {
res.json({data:'success'});
       } 
    })
})

app.listen(8001);
