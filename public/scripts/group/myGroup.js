// handlebars context
  var data= {
      group: []
      };
  var member = new AV.Op.Relation();
function setupData() {
  //var query    = new AV.Query('Group');
  var query = AV.Relation.reverseQuery('Group', 'member', currentUser);
  query.include('leader');
  query.include('member');
  query.find().then(function(group){
    //获取用户在云存储的数据
    var name        = group[0].get('name');
    var leaderName = group[0].get('leader').get('name');
    var flag        = group[0].get('flag');
    var number      = group[0].get('number');
    member = group[0].get('member');
    member.parent = group[0];
    var publicity;
    if(flag == 0)
      publicity = '隐藏';
    else if(flag == 1)
      publicity = '密码模式';
    else if(flag == 2)
      publicity = '公开';
    // handlebars context
    data.group.push({
      publicity,
      leaderName,
      name,
      publicity,
      number
  }); 

  // handlebars helper     
  $(document).ready(function() {
      var source      = $("#userGroup").html();
      var template    = Handlebars.compile(source);
      $('#tableList').html(template(data));
  });  
  //Quit the Group
  $(".quitGroup").on('submit', function(e) {
    e.preventDefault();
    member.remove(currentUser);
    group[0].set('number', number - 1);
    // if(currentUser == group[0].get('leader'));
    // {
    //   var query1 = member.query();
    //   query1.find().then(function(user){
    //     alert(user[0]);
    //     group[0].save();
    //   }, function(error){

    //   });
    // }
    // else
      group[0].save();
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
