/*
  maintain a list of visible pnode.

  visible pnode :
     1) pnode within text viewport
     2) pinned or selected

  //query
*/

var Reflux=require("reflux");
var actions=require("../actions/pnode");
var store_paradigm=require("../stores/paradigm");

var store_pnode=Reflux.createStore({
	listenables:actions,
	pnodes:[]
	,onOpen:function(pcode,dbid){
		var pd=store_paradigm.load(dbid);
		if (!pd) return;
		var pnode=pd.get(pcode);
		this.pnodes.push([pcode, pnode, dbid]);
		this.trigger(this.pnodes);
	}
	,onClose:function(pcode) {
		var touched=false;
		for (var i=0;i<this.pnodes.length;i++) {
			var pnode=this.pnodes[i];
			if (pnode[0]===pcode) {
				this.pnodes.splice(i,1);
				touched=true;
				break;
			}
		}
		if (touched) this.trigger(this.pnodes);
	}

});

module.exports=store_pnode;
