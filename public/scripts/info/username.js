// handlebars context
  var data= {
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
}

function changeInfo() {
  var username = $('#inputUsername').val();
  // LeanCloud - 注册
  // https://leancloud.cn/docs/leanstorage_guide-js.html#注册
  currentUser.set('username', username);
  currentUser.save().then(function (User) {
  window.location.href = "../info";
  }, (function (error) {
    alert(JSON.stringify(error));
  }));
};

$(function() {
  if (isCurrentUser()) {
    setupData();
  } else {
   window.location.href = "../login";
  }
});

$(function() {
  $(".changeInfo").on('submit', function(e) {
    e.preventDefault();
    changeInfo();
  });
});