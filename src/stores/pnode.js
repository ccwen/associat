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
		var usedby=pd.by(pcode);
		this.pnodes.push([pcode, pnode, dbid,null]); //will be calculated in onUpdate
		this.onUpdate();
	}
	,onClose:function(pcode,dbid) {
		var touched=false;
		for (var i=0;i<this.pnodes.length;i++) {
			var pnode=this.pnodes[i];
			if (pnode[0]===pcode&&pnode[2]===dbid) {
				this.pnodes.splice(i,1);
				touched=true;
				break;
			}
		}
		if (touched) this.trigger(this.pnodes);
	}
	,onUpdate:function() {
		for (var i=0;i<this.pnodes.length;i++) {
			var item=this.pnodes[i];
			var pd=store_paradigm.load(item[2]);
			this.pnodes[i][3]=pd.by(item[0]);
		}
		this.trigger(this.pnodes);
	}

});

module.exports=store_pnode;
