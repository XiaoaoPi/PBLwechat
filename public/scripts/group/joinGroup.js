// handlebars context
var data = {
  groups: []
};
var ofClass;
var name;
var leaderName;
var flag;
var password;
var groupId;
var member = new AV.Op.Relation();
var query = new AV.Query('Group');

function setupData(ofClass) {
  query.containedIn('ofClass', [ofClass]);
  query.containedIn('flag', [0, 2]);
  query.include('leader');
  query.include('member');
  query.find().then(function(groups) {
    groups.forEach(function(group) {
      //获取用户在云存储的数据
      groupId = group.get('objectId');
      name = group.get('name');
      leader = group.get('leader');
      leaderName = leader.get('name');
      flag = group.get('flag') - 2;
      password = group.get('password');
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
      var source = $("#userGroup").html();
      var template = Handlebars.compile(source);
      $('#tableList').html(template(data));
    });

  });
}

function applyJoinGroup() {
  var objectId = $('input:radio[name="group"]:checked').val();
  var inputPassword = $('#inputPassword').val();
  var extraInfo = $('#inputReason').val();
  var query = new AV.Query('Group');
  query.containedIn('objectId', [objectId]);
  query.include('member');
  query.include('ofClass');
  query.find().then(function(groups) {
    var group = groups[0];
    if (!group) {
      $.alert('没有找到这个小组。')
      return;
    }
    var flag = group.get('flag');
    var password = group.get('password');
    //var number = group.get('number');
    var groupOfClass = group.get('ofClass');
    if (groupOfClass.get('objectId') != ofClass.get('objectId')) {
      $.alert('没没有找到这个小组或者该小组处于隐藏状态。');
      return;
    }
    if (flag == 2 && password != inputPassword) {
      $.alert('密码错误。', '申请失败');
      return;
    } else { //生成一个小组申请表
      var applyJoinGroup = AV.Object.extend('ApplyJoinGroup');
      var applyJoinGroup = new applyJoinGroup();
      applyJoinGroup.set('targetGroup', group);
      applyJoinGroup.set('applyUser', currentUser);
      applyJoinGroup.set('extraInfo', extraInfo);
      applyJoinGroup.set('state', 0);
      applyJoinGroup.save().then(
        function(table) {
          window.location.href = "../success?event=joinGroup";
        }, (function(error) {
          $.alert(JSON.stringify(error));
        }));
    }
  }, function(error) {
    $.alert(JSON.stringify(error));
  });

};


$(function() {
  if (isCurrentUser()) {
    currentUser.fetch({
      keys: 'class'
    }).then(
      function(user) {
        ofClass = user.get('class');
        setupData(ofClass);
        $(".inputInfo").on('submit', function(e) {
          e.preventDefault();
          var query = AV.Relation.reverseQuery('Group', 'member', currentUser);
          query.include('member');
          query.find().then(function(group) {
            if (!group[0]) {
              applyJoinGroup();
            } else {
              $.alert('你已经有小组了。');
            }
          }, function(error) {
            $.alert(JSON.stringify(error));
          });
        });
      },
      function(error) {
        $.alert(JSON.stringify(error));
      }
    );
  } else {
    window.location.href = "../login";
  }
});