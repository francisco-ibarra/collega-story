/* Home component. 
   It prompts the instagram account to the user 
*/


exports.Component = {
  template: "#experiment-start",
  data : function(){
    return {
      username : ""
    };
  },
  
  methods : {
    startSession: function(){
      console.log(this.username)
      this.$router.push({name : 'user', 
                         params : {user : this.username}});
    }
  }
};


