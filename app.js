'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var account = require('./routes/account');
var group = require('./routes/group');
var problem = require('./routes/problem');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');
// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');


var app = express();
var hbs = require('hbs');
var arr = new Array();
    arr[0]=path.join(__dirname, 'views'),
    arr[1]=path.join(__dirname, 'views/account'),
    arr[2]=path.join(__dirname, 'views/group'),
    arr[3]=path.join(__dirname, 'views/problem');
app.engine('html', hbs.__express);
// 设置模板引擎
app.set('views', arr);
app.set('view engine', 'html');
app.use(express.static('public'));

// 设置默认超时时间
app.use(timeout('15s'));

// 加载云引擎中间件
app.use(AV.express());
app.enable('trust proxy');
// 需要重定向到 HTTPS 可去除下一行的注释。
// app.use(AV.Cloud.HttpsRedirect());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/account', account);
app.use('/group', group);
app.use('/problem', problem);
app.get('/signup', function(req, res) {
    res.render('signup');
});
app.get('/login', function(req, res) {
    res.render('login', {title: ''});
});
app.get('/success', function(req, res) {
    res.render('success');
});
app.get('/menu', function(req, res) {
    res.render('menu');
});
// 可以将一类的路由单独保存在一个文件中
/*app.use('/todos', require('./routes/todos'));*/

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {}
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
