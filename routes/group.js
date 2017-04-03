'use strict';
var express = require('express');
var router = express.Router();

// 新增 Todo 项目
/*router.get('/', function(req, res) {
  res.render('info', {title: "user's info"});
});*/
router.get('/createGroup', function(req, res) {
  res.render('createGroup', {title: "create new group"});
});
router.get('/myGroup', function(req, res) {
  res.render('myGroup', {title: "group info"});
});
router.get('/joinGroup', function(req, res) {
  res.render('joinGroup', {title: "join a group"});
});
router.get('/changeGroupInfo', function(req, res) {
  res.render('changeGroupInfo', {title: "change group info"});
});
module.exports = router;
