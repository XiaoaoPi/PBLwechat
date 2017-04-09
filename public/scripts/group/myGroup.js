// handlebars context
var data = {
  group: []
};
var userData = {
  members: []
};
var member = new AV.Op.Relation();
var number;
var group;

function setupData() {
  //var query    = new AV.Query('Group');
  var query = AV.Relation.reverseQuery('Group', 'member', currentUser);
  query.include('leader');
  query.include('member');
  query.find().then(function(groups) {
    //获取用户在云存储的数据
    group = groups[0];
    var name = group.get('name');
    var leaderName = group.get('leader').get('name');
    var flag = group.get('flag');
    var publicity;
    if (flag == 1)
      publicity = '隐藏';
    else if (flag == 2)
      publicity = '密码模式';
    else if (flag == 0)
      publicity = '公开';
    number = group.get('number');
    member = group.get('member');
    member.parent = group;
    var query1 = member.query();
    query1.find().then(function(users) {
      users.forEach(function(user) {
        var username = user.get('username');
        var membername = user.get('name');
        userData.members.push({
          username,
          membername
        });
        // handlebars helper
        $(document).ready(function() {
          var source = $("#memberInfo").html();
          var template = Handlebars.compile(source);
          $('#groupMember').html(template(userData));
        });
      });
    });

    // handlebars context
    data.group.push({
      publicity,
      leaderName,
      name,
      publicity,
      number
    });
    $(document).ready(function() {
      var source = $("#memberInfo").html();
      var template = Handlebars.compile(source);
      $('#groupMember').html(template(userData));
      var source = $("#userGroup").html();
      var template = Handlebars.compile(source);
      $('#tableList').html(template(data));
    });
  });
}

function quitGroup() {
  var ofClass = currentUser.get('class');
  var query0 = new AV.Query('Tag')
  query0.containedIn('ofClass', [ofClass]);
  query0.find().then(function(tags) {
    var tag = tags[0];
    if (tag.get('group_mode')) {
      $.confirm({
        title: '确认退出？',
        text: '退出小组之后在组内的信息可能无法恢复。',
        onOK: function() { //确认
          member.remove(currentUser);
          number = number - 1;
          group.set('number', number);
          if (!number) {
            group.destroy().then(function() {
              window.location.href = "../success?event=quitGroup";
            }, function(error) {
              $.alert(JSON.stringify(error));
            });
          } else if (currentUser.get('objectId') == group.get('leader').get('objectId')) {
            var query2 = member.query();
            query2.notContainedIn('objectId', [currentUser.get('objectId')]);
            query2.find().then(function(users) {
              group.set('leader', users[0]);
              group.save().then(function() {
                window.location.href = "../success?event=quitGroup";
              }, function(error) {
                $.alert(JSON.stringify(error));
              });
            }, function(error) {
              $.alert(JSON.stringify(error));
            });
          } else {
            group.save().then(function() {
              window.location.href = "../success?event=quitGroup";
            }, function(error) {
              $.alert(JSON.stringify(error));
            });
          }
        },
        onCancel: function() {}
      });
    } else {
      $.confirm({
        title: '温馨提示',
        text: '由于老师目前停止了小组的自由组合，所以退出小组的申请要经由老师同意后才能生效。退出小组之后在组内的信息将无法恢复，确认发出退出申请么。',
        onOK: function() { //确认发出申请
          var ExitGroupApply = AV.Object.extend('ExitGroupApply');
          var ExitGroupApply = new ExitGroupApply();
          ExitGroupApply.set('ofClass', currentUser.get('class'));
          ExitGroupApply.set('applyer', currentUser);
          //ExitGroupApply.set('extraInfo', extraInfo);
          ExitGroupApply.set('state', 0);
          ExitGroupApply.save().then(
            function(table) {
              window.location.href = "../success?event=joinGroup";
            }, (function(error) {
              $.alert(JSON.stringify(error));
            }));
        },
        onCancel: function() {}
      });
    }
  }, function(error) {
    $.alert(JSON.stringify(error));
  });

}
$(function() {
  if (isCurrentUser()) {
    setupData();
  } else {
    window.location.href = "../login";
  }
});