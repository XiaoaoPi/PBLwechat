var Group = AV.Object.extend('Group');
var currentUser = AV.User.current();

function createGroup(groupName, ofClass) {
  var flag = $('input:radio[name="flag"]:checked').val();
  var password = $('#inputPassword').val();
  var leaderObectId = currentUser.get('objectId');
  var group = new Group();
  var ofClass;
  group.set('ofClass', ofClass);
  /*小组长成为小组成员*/
  var member = [currentUser];
  var relation = group.relation('member'); // 创建 AV.Relation
  member.map(relation.add.bind(relation));
  if (!flag) {
    $.alert('请选择合适的对外权限');
    return 0;
  }
  if (flag == '0')
    group.set('flag', 0);
  else if (flag == '1')
    group.set('flag', 1);
  else if (flag == '2')
    group.set('flag', 2);

  group.set('leader', currentUser);
  group.set('number', 1);
  group.set('name', groupName);
  group.set('password', password);
  group.save().then(function(group) {
    window.location.href = "../success?event=changeGroupError";
  }, (function(error) {
    $.alert(JSON.stringify(error));
  }));
};

$(function() {
  if (isCurrentUser()) {
    var ofClass = currentUser.get('class');
    var query0 = new AV.Query('Tag')
    query0.containedIn('ofClass', [ofClass]);
    query0.find().then(function(tags) {
      var tag = tags[0];
      if (tag.get('group_mode')) {
    $(".createGroup").on('submit', function(e) {
      e.preventDefault();

      var groupName = $('#inputGroupName').val();
      /*获取User中class对象的实例*/
      var query = new AV.Query('Group');
      query.include('ofClass');
      query.include('member');
      query.containedIn('name', [groupName]);
      query.containedIn('ofClass', [ofClass]);
      query.find().then(function(groups) { //检查是否重名
        var group = groups[0];
        if (!group) {
          var query1 = AV.Relation.reverseQuery('Group', 'member', currentUser);
          query1.find().then(function(group) { //检查当前用户是否已经有小组了
            if (!group[0]) {
              createGroup(groupName, ofClass);
            } else {
              $.alert('你已经有小组了。', function() {
                window.location.href = "/group/myGroup";
              });
            }
          }, function(error) {
            $.alert(JSON.stringify(error));
          });
        } else {
          $.alert('该小组名已经存在了', function() {
            window.location.reload();
          });

        }
      });

    });
        
      } else {
        $.alert('老师目前停止了小组的自由组合，如果仍有需求，请与老师联系。', function() {
          window.location.href = '../menu';
        });
      }
    }, function(error) {
      $.alert(JSON.stringify(error));
    });
  } else {
    window.location.href = "../login";
  }
});