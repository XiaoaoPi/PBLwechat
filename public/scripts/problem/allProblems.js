// handlebars context
  var data= {
      problems: []
      };
  var ofClass;
  var member       = new AV.Op.Relation();  
  var query        = new AV.Query('Problem');
function setupData(ofClass) {
  query.containedIn('ofClass', [ofClass]);
  query.find().then(function(problems){
    problems.forEach(function(problem) {
    //获取用户在云存储的数据
    var title      = problem.get('title');
    var difficulty = problem.get('difficulty');
    var speakTime  = problem.get('speakTime');
    // handlebars context
    data.problems.push({
      title,
      difficulty,
      speakTime
  }); 
  });
  // handlebars helper     
  $(document).ready(function() {
      var source      = $("#problem").html();
      var template    = Handlebars.compile(source);
      $('#tableList').html(template(data));
  });  
  });
}

function applyForProblem(){
  var title = $('#inputTitle').val();
  var extraInfo = $('#inputReason').val();
  var query    = new AV.Query('Problem');
    query.containedIn('title', [title]);
    query.containedIn('ofClass', [ofClass]);
    query.find().then(
      function(problems){
      var problem = problems[0];
      if(!problem)
        {
          alert('没有找到这个课题。')
          return -1;
        }
      var ProblemApplyTable = AV.Object.extend('ProblemApplyTable');
      var problemApplyTable = new ProblemApplyTable();
      problemApplyTable.set('ofClass', ofClass);
      problemApplyTable.set('problem', problem);
      problemApplyTable.set('extraInfo', extraInfo);
      problemApplyTable.set('state', 0);
      problemApplyTable.save().then(
        function (table) {
        //window.location.href = "../info";
        }, (function (error) {
        alert(JSON.stringify(error));
        }));
      }, function(error){
      alert('查找出错。');
    });

  };


$(function() {
  if (isCurrentUser()) {
    currentUser.fetch({keys:'class,group'}).then(
    function(user){
      ofClass = user.get('class');
      setupData(ofClass);

    $(".inputInfo").on('submit', function(e) {
    e.preventDefault();
    var query = AV.Relation.reverseQuery('Group', 'member', currentUser);
    query.include('leader');
    query.find().then(
      function(group){
      if(group){
        if(group.get('leander').get('objectId')==currentUser.get('objectId'))
            applyForProblem(group);
        else
        {
          alert('你还不是本组小组长哦');
          return -1;
        }
      }
      else{
      alert('你还没有加入任何组织哦。')
      return -1;
      }
      });
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
