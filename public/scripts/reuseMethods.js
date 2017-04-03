var currentUser ;
function isCurrentUser () {
  currentUser = AV.User.current();
  if (currentUser) {
    return true;
  }
  return false;
};

function isCurrentLeader(user){
	
};