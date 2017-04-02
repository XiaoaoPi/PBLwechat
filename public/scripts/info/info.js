// handlebars context
  var data= {
      user: []
      };
function setupData() {
  var username = currentUser.get('username');
  //
  var query    = new AV.Query('_User');
  query.containedIn('username', [username]);
  query.find().then(function (user) {
    //获取用户在云存储的数据
    var username  = user[0].get('username');
    var name      = user[0].get('name');
    var gender;
    var sex      = user[0].get('sex');
    var email     = user[0].get('email');
    var mobilePhoneNumber = user[0].get('mobilePhoneNumber');
    var userImage = user[0].get('image');
    var userImageUrl;
    if (userImage) {
      userImageUrl = userImage.get('url');
    } else {
      userImageUrl = './../storage.png'
    }
    if(sex == 0)
      gender = '男';
    else
      gender = '女';
    // handlebars context
    data.user.push({
      gender,
      userImageUrl,
      mobilePhoneNumber,
      username,
      name,
      email,
  });  

  // handlebars helper     
  $(document).ready(function() {
     var source      = $("#userInfo").html();
     var template    = Handlebars.compile(source);
   $('#tableList').html(template(data));
  });  
  });
}

$(function() {
  if (isCurrentUser()) {
    setupData();
  } else {
   window.location.href = "login";
  }
});