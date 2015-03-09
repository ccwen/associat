/*
  maintain a list of visible pnode.

  visible pnode :
     1) pnode within text viewport
     2) pinned or selected

  //query
*/

var Reflux=require("reflux");
var actions=require("../actions/pnode");

var store_pnode=Reflux.createStore({
	listenables:actions,
	pnodes:[]
	,onOpen:function(){

	}
	,onCreate:function() {
		this.pnodes.unshift({name:"noname"});
		this.trigger(this.pnodes);
	}
	,onClose:function(pnode) {
		var i=this.pnodes.indexOf(pnode);
		if (i>-1) this.pnodes.splice(i,1);
		this.trigger(this.pnodes);
	}

});

module.exports=store_pnode;
