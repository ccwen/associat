var Reflux=require("reflux");
var actions=require("../actions/context");
var store_context=Reflux.createStore({
  data:[]
  ,listenables:actions
  ,onSavecontext:function(data){
    console.log("savecontext");
  }
});
module.exports=store_context;
