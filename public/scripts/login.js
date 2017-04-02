/*注册的时候还无法将pbl账户和openid绑定*/
/*注册成功后应该跳转至注册成功界面，并且关闭窗口*/
function login() {
  var username = $('#inputUsername').val();
  var password = $('#inputPassword').val();

  // PBL账户 - 登录
  // 用户名和密码登录
  AV.User.logIn(username, password).then(function (loginedUser) {
    window.location.href = "/group/myGroup";
  }, function (error) {
    alert(JSON.stringify(error));
  });
};

$(function() {
  $(".form-signin").on('submit', function(e) {
    e.preventDefault();
    login();
  });
});
