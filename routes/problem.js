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
router.get('/myProblems', function(req, res) {
  res.render('myProblems', {title: "my projects"});
});
module.exports = router;
