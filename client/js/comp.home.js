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
    openPhotos: function(){
      console.log(this.username)
      this.$router.push({name : 'photos', 
                         params : {user : this.username}});
    },
    openStories: function(){
      console.log(this.username)
      this.$router.push({name : 'stories', 
                         params : {user : this.username}});
    }    
  }
};


