var Group = AV.Object.extend('Group');
var currentUser = AV.User.current();
function createGroup() {
  var groupName = $('#inputGroupName').val();
  var flag= $('input:radio[name="flag"]:checked').val();
  var password = $('#inputPassword').val();
  var leaderObectId = currentUser.get('objectId');
  var group = new Group();
  var ofClass;
  /*获取User中class对象的实例*/
  currentUser.fetch({keys:'class'}).then(
    function(user){
      ofClass = user.get('class');
      group.set('ofClass', ofClass);
      group.save().then(
      function(group){
      }, 
      function(error){
        alert(JSON.stringify(error));
      });  
    }, 
    function(error){
    alert(JSON.stringify(error));
    }
);
  /*小组长成为小组成员*/
  var member = [currentUser];
  var relation = group.relation('member'); // 创建 AV.Relation
  member.map(relation.add.bind(relation));
  if(flag == '0')
    group.set('flag', 0);
  else if(flag == '1')
    group.set('flag', 1);
  else if(flag == '2')
    group.set('flag', 2);

  group.set('ofClass', ofClass);
  group.set('leader', currentUser);  
  group.set('number', 1);
  group.set('name', groupName);
  group.set('password', password);
  group.save().then(function (group) {
  //window.location.href = "../info";
  }, (function (error) {
    alert(JSON.stringify(error));
  }));
};

$(function() {
  if (isCurrentUser()) {
  $(".createGroup").on('submit', function(e) {
    e.preventDefault();
    createGroup();
  });
  } else {
   window.location.href = "../login";
  }
});

