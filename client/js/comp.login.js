/* Home component. 
   It prompts the instagram account to the user 
*/

var Models = require('./models');

exports.Component = {
  template: "#page-login",
  data: function () {
    return {
      username: "",
      password: ""
    };
  },

  methods: {
    login: function () {
      console.log(this.username);

      var self = this;
      Models.User.login({
        username: this.username
      }, {
        success: function (user) {
          console.log(user);
          var account = user.accounts[0];

          if (user.accounts.length > 1) {
            alert("Resident selection is not implemented. " +
              "Using first by default");
          }

          Models.Session.setCurrentAccount(account);
          self.$router.push({
            name: 'home'
          });

        },
        error: function (e) {
          console.log("Invalid credentials");
        }
      });
    },
    logout : function(){
      Models.Session.invalidate();
    }
  },
  created : function (){
      // user route instead...
      console.log(this.$route);
      if (this.$route.name == "logout"){
        this.logout();
      }
    }  
};