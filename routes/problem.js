'use strict';
var express = require('express');
var router = express.Router();

// 新增 Todo 项目
/*router.get('/', function(req, res) {
  res.render('info', {title: "user's info"});
});*/
router.get('/allProblems', function(req, res) {
  res.render('allProblems', {title: "show the projects"});
});
router.get('/myGroup', function(req, res) {
  res.render('myGroup', {title: "group info"});
});
router.get('/joinGroup', function(req, res) {
  res.render('joinGroup', {title: "join a group"});
});
module.exports = router;
