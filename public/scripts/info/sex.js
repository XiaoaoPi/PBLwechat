//handlebars 和form便签同时存在时的问题
// handlebars context
/*  var data= {
      user: []
      };
function setupData() {
  var username = currentUser.get('username');
  var query    = new AV.Query('_User');
  query.containedIn('username', [username]);
  query.find().then(function (user) {

    // handlebars context
    data.user.push({
      username
  });  

  // handlebars helper     
  $(document).ready(function() {
     var source      = $("#username").html();
     var template    = Handlebars.compile(source);
   $('#tableList').html(template(data));
  });  
  });
}*/

function changeInfo() {
  var sex= $('input:radio[name="sex"]:checked').val();
  // LeanCloud - 注册
  // https://leancloud.cn/docs/leanstorage_guide-js.html#注册
  if(sex == '0')
    currentUser.set('sex', 0);
  else
    currentUser.set('sex', 1);
  currentUser.save().then(function (User) {
  window.location.href = "../info";
  }, (function (error) {
    alert(JSON.stringify(error));
    //window.location.href = "../info";
  }));
};

$(function() {
  if (isCurrentUser()) {
    //setupData();
  $(".changeInfo").on('submit', function(e) {
    e.preventDefault();
    changeInfo();
  });
  } else {
   window.location.href = "../login";
  }
});

