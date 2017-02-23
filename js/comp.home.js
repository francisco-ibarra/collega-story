/* Home component. 
   It prompts the instagram account to the user 
*/
Story.Components = {}


/* The template is currently in the index.html file. However, we should move this to this file in the future */
Story.Components.Home = {
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
}

