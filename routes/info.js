'use strict';
var express = require('express');
var router = express.Router();

// 新增 Todo 项目
router.get('/', function(req, res) {
  res.render('info', {title: "user's info"});
});
/*router.get('/avatar', function(req, res) {
  res.render('avatar', {title: "user's avatar"});
});*/
router.get('/name', function(req, res) {
  res.render('name', {title: "user's name"});
});
router.get('/username', function(req, res) {
  res.render('username', {title: "user's username"});
});
router.get('/age', function(req, res) {
  res.render('age', {title: "user's age"});
});
router.get('/sex', function(req, res) {
  res.render('sex', {title: "user's sex"});
});
router.get('/mobilePhoneNumber', function(req, res) {
  res.render('mobilePhoneNumber', {title: "user's phone"});
});
router.get('/email', function(req, res) {
  res.render('email', {title: "user's phone"});
});
module.exports = router;
