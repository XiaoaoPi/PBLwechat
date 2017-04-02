var router = require('express').Router();
var AV = require('leanengine');

// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
var wechat = require('wechat');
var config = {
  token: 'suyuelihaile',
  appid: 'wx013ac876fdb99110',
  encodingAESKey: 'lZk63D154UO6zk23Va3frRdnOqLvolQm96SK99z70ui'
};

var WechatAPI = require('wechat-api');
var api = new WechatAPI('wx013ac876fdb99110',
  'cf5a1df6ba5c4c20933a53f2fca96229');

router.use('/', wechat(config.token).middlewarify());

module.exports = router;