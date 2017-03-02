/* Home component. 
   It prompts the instagram account to the user 
*/

var Models = require("./models");

exports.Component = {

  template: "#page-home",
  props : ['session'],
  data : function(){
    return {
      profile : {}
    };
  },
  
  methods : {
    
    loadProfile : function (user){
      var self = this;
      Models.User.loadProfile(user, function(profile){
        self.profile = profile;
        console.log(profile)
      });
    },
    
    goTo : function(page){
      this.$router.push({ name: page});
    }
  },
  
  created : function(){
    var account = this.session.getCurrentAccount()
    this.loadProfile(account.username);
  }  
};