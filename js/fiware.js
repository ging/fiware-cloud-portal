$(document).ready(function(){
  
UTILS.Auth.initialize("http://138.4.24.120:5000/");

var view = new AppView({model: new LoginStatus()});

$('body').append(view.render().el);

})