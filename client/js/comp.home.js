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
      Models.User.loadProfile(user, {
        success : function(profile){
          self.profile = profile;
          console.log(profile);
        },
        error : function (error){
          console.log("session expired")
          self.$router.push({ name: 'login'})
        }
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