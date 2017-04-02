// handlebars context
  var data= {
      groups: []
      };
  var ofClass;
  var name;      
  var leaderName; 
  var flag;       
  var password;
  var groupId;
  var member = new AV.Op.Relation();  
  var query    = new AV.Query('Group');

function setupData(ofClass) {
  query.containedIn('ofClass', [ofClass]);
  query.greaterThan('flag', 0);
  query.include('leader');
  query.include('member');
  query.find().then(function(groups){
    groups.forEach(function(group) {
    //获取用户在云存储的数据
    groupId = group.get('objectId');
    name        = group.get('name');
    leader  = group.get('leader');
    leaderName = leader.get('name');
    flag        = group.get('flag') - 1;
    password    = group.get('password');
    // handlebars context
    data.groups.push({
      leaderName,
      flag,
      name,
      groupId
  }); 
  });
  // handlebars helper     
  $(document).ready(function() {
      var source      = $("#userGroup").html();
      var template    = Handlebars.compile(source);
      $('#tableList').html(template(data));
  });  

  });
}

function joinGroup(){
  var groupName = $('#inputGroupName').val();
  var inputPassword = $('#inputPassword').val();
    var query    = new AV.Query('Group');
    query.containedIn('name', [groupName]);
    query.include('member');
    query.include('class');
    query.find().then(function(groups){
      var group = groups[0];
      if(!group)
        {
          alert('没有找到这个小组。')
          return -1;
        }
      var flag = group.get('flag');
      var password = group.get('password');
      var number = group.get('number');
      var groupOfClass = group.get('ofClass');
      if(groupOfClass.get('objectId') != ofClass.get(objectId))
        {
          alert('没有找到这个小组。')
          return -1;
        }
      switch(flag)
      {
        case 0: 
          alert('没有找到这个小组。');   
        break;
        case 1:
          if(password != inputPassword)
            {
              alert('密码错误。')
              break;
            }
        case 2:
        {
          var member = new AV.Op.Relation();
          member = group.get('member');
          member.parent = group;
          member.add(currentUser);
          group.set('number', number + 1);
          group.save();
        }
      }
    }, function(error){
      alert('查找出错。');
    });

  };


$(function() {
  if (isCurrentUser()) {
    currentUser.fetch({keys:'class'}).then(
    function(user){
      ofClass = user.get('class');
      setupData(ofClass);
    $(".inputInfo").on('submit', function(e) {
    e.preventDefault();
    joinGroup();
  });
    }, 
    function(error){
    alert(JSON.stringify(error));
    }
);
  } else {
   window.location.href = "login";
  }
});