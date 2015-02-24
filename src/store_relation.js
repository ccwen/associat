var Reflux=require("reflux");
var actions=require("./action_relation");
var Reflux.createStore({
	listenables:actions,
	onOpenPNode:function(){
		
	}
})