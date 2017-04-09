// handlebars context
var data = {
  problems: []
};
var ofClass;
var member = new AV.Op.Relation();
var query = new AV.Query('Problem');

function setupData(ofClass) {
  query.containedIn('ofClass', [ofClass]);
  query.find().then(function(problems) {
    problems.forEach(function(problem) {
      //获取用户在云存储的数据
      var title = problem.get('title');
      var objectId = problem.get('objectId');
      var difficulty = problem.get('difficuty');
      var date = problem.get('speakTime');
      var speakTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      // handlebars context
      data.problems.push({
        title,
        objectId,
        difficulty,
        speakTime
      });
    });
    // handlebars helper     
    $(document).ready(function() {
      var source = $("#problem").html();
      var template = Handlebars.compile(source);
      $('#tableList').html(template(data));
    });
  });
}

function applyForProblem(group) {
  var objectId = $('input:radio[name="problem"]:checked').val();
  var extraInfo = $('#inputReason').val();
  var query = new AV.Query('Problem');
  query.containedIn('objectId', [objectId]);
  query.find().then(
    function(problems) {
      var problem = problems[0];
      if (!problem) {
        $.alert('没有找到这个课题。')
        return -1;
      }
      var ProblemApplyTable = AV.Object.extend('ProblemApplyTable');
      var problemApplyTable = new ProblemApplyTable();
      problemApplyTable.set('ofClass', ofClass);
      problemApplyTable.set('problem', problem);
      problemApplyTable.set('group', group);
      problemApplyTable.set('extraInfo', extraInfo);
      problemApplyTable.set('state', 0);
      problemApplyTable.save().then(
        function(table) {
          window.location.href = "../success?event=applyForProblem";
        },
        function(error) {
          $.alert(JSON.stringify(error));
        });
    },
    function(error) {
      $.alert(JSON.stringify(error));
    });

};


$(function() {
  if (isCurrentUser()) {
    currentUser.fetch({
      keys: 'class,group'
    }).then(
      function(user) {
        ofClass = user.get('class');
        setupData(ofClass);

        $(".inputInfo").on('submit', function(e) {
          e.preventDefault();
          var query = AV.Relation.reverseQuery('Group', 'member', currentUser);
          query.include('leader');
          query.find().then(
            function(groups) {
              var group = groups[0];
              if (group) {
                if (group.get('leader').get('objectId') == currentUser.get('objectId')) {
                  var query1 = new AV.Query('ProblemGroup');//检验是否已经有课题了
                  query1.containedIn('group', [group]);
                  query1.find().then(function(ProblemGroups) {
                    var ProblemGroup = ProblemGroups[0];
                    if (ProblemGroup) {
                      $.alert('你们小组已经有课题了哦。', function() {
                        window.location.reload();
                        return -1;
                      });
                    } else {
                      applyForProblem(group);
                    }
                  }, function(error) {
                    $.alert(JSON.stringify(error));
                  });

                } else {
                  $.alert('你还不是本组小组长哦');
                  return -1;
                }
              } else {
                $.alert('你还没有加入任何组织哦。')
                return -1;
              }
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