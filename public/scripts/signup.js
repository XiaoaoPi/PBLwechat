/*微信的openid尚未绑定到用户的信息中 */
/*注册成功后应该跳转至注册成功界面，并且关闭窗口*/
  var user = new AV.User();
function signup() {
  var username = $('#inputUsername').val();
  var password = $('#inputPassword').val();
  
  // LeanCloud - 注册
  // https://leancloud.cn/docs/leanstorage_guide-js.html#注册
  user.setUsername(username);
  user.setPassword(password);
  user.signUp().then(function (loginedUser) {

    //window.location.href = "/info";
  }, (function (error) {
    alert(JSON.stringify(error));
  }));
};

function info(){
    var email    = $('inputEmail').val();
    alert(email);
    user.set('email', email);
    user.save();
}
$(function() {
  $(".form-signup").on('submit', function(e) {
    e.preventDefault();
    signup();
    info();
  });
});
