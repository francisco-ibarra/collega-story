var axios = require("axios");

var User = {
  
    login: function(cred, cb){
      axios.post("/api/login", cred)
      .then(function(response){
        console.log(response.status < 300 );
        Session.start(response.data);
        cb.success(response.data);        
      })
      .catch(function(error){
        Session.invalidate();
        cb.error && cb.error(error);
      });
    },
  
    loadProfile: function(id, cb) {
        axios.get("/api/accounts/{0}".replace("{0}", id))
        .then(function(response){
          Session.setProfile(response.data);
          cb.success(response.data);
        })
      .catch(function(error){
        Session.invalidate();
        if(cb.error) cb.error(error);
      });        
    }  

};

var Session = {
  currentUser : null,
  currentAccount : null,  
  profile : null,
  
  start : function(user){    
    this._store('currentUser', user);
  },  
  isValid : function(){
    if (this.currentUser != null) 
      return true;
    
    this.currentUser = this._retrieve('currentUser');
    if (this.currentUser == null)
      return false;
    
    this.profile = this._retrieve('profile');
    this.currentAccount = this._retrieve('currentAccount');
    return true;
    
  },
  invalidate : function() {
    this._rm('currentUser');
    this._rm('currentAccount');
    this._rm('profile');
  },
  
  setCurrentAccount : function(account){
    this._store('currentAccount', account);
  },
  getCurrentAccount : function(){
    return this.currentAccount;
  },
  
  setProfile : function(profile){    
    this._store('profile', profile);    
  },
  getProfile : function(){
    return this.profile;
  },
  
  _store : function(name, obj){
    localStorage.setItem(name, JSON.stringify(obj));  
    this[name] = obj;
  },
  _retrieve : function(name){
    var item = localStorage.getItem(name);
    return item == null? null : JSON.parse(item);
  },
  _rm : function(name){
    localStorage.removeItem(name);
    this[name] = null;
  }
  
};

exports.User = User;
exports.Session = Session;
