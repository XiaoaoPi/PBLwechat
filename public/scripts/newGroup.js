function () {
  var username = $('#inputGroupname').val();
  var password = $('#inputPassword').val();
  var email = $('inputEmail').val();
  var openid = 
  
  // LeanCloud - 注册
  // https://leancloud.cn/docs/leanstorage_guide-js.html#注册
  var user = new AV.User();
  user.setUsername(username);
  user.setPassword(password);
  user.setEmail(email);
  // user.set('openid', openid);
  user.signUp().then(function (loginedUser) {
    window.location.href = "signup_success";
  }, (function (error) {
  	alert(JSON.stringify(error));
  }));
};

$(function() {
  $(".form-signup").on('submit', function(e) {
    e.preventDefault();
    signup();
  });
});