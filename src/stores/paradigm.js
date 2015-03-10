/*
  relations in memory, sync access.
  prefetch from (pouchdb) async
*/

var Reflux=require("reflux");
var actions=require("../actions/paradigm");
var actions_pnode=require("../actions/pnode");
var Paradigm=require("ksana-paradigm");
var debug=false;
var relations={
	145153:[{caption:"18段"}]
	,516:[{caption:"引用"}]
	,1024:[{caption:"R4"},"aaa",517,"bb"]
	,517:[{caption:"引用2"}]
	,768:[{caption:"R3"},"xxxx",1024,"qqqq"]
	,256: [ {caption:"R2"} ,"c1", 516, "c2", 768]
	,512: [{caption:"R1"} ,"b1", 256 , "b2",256]
};


var store_paradigm=Reflux.createStore({
	listenables:actions
	,barrels:{}
	,load:function(dbname) {
		if (!this.barrels[dbname]){
			var relations=localStorage.getItem(dbname+"_relations")||"";
			this.barrels[dbname]=Paradigm.barrel.loadFromString(dbname,relations);
		}
		if (debug) console.log("load markup of db",dbname,this.barrels[dbname]);
		return this.barrels[dbname];
	}
	,save:function(dbname) {
		localStorage.setItem(dbname, this.barrels[dbname].saveToString() );
	}
	,saveAll:function() {
		for (var i in this.barrels) this.save(i);
	}
	,onSetVisibleRange:function(db,fromvpos,tovpos) {
		if (debug) console.log("setvisible range of ",db.dbname)
		var out=[]; //  each item: [start_offset,end_offset, pcode, data ....]

		this.trigger(db,out);
	}
	,wid2dbid:function(wid) {
		var i=wid.lastIndexOf("_");
		return wid.substr(0,i);
	}
	,parseSelection:function(wid_selections) {
		// first key in wid_selections is master db, the rest are foreign
		var wid=Object.keys(wid_selections);
		if (wid.length==0) return null;
		var res={ master:wid[0] , master_selections:null,foreign_selections:null };

		for (var i in wid_selections) {
			if (i==res.master) {
				res.master_selections=wid_selections[i];
			} else {
				if (!res.foreign_selections) res.foreign_selections={};
				var foreign_db=this.wid2dbid(i);
				res.foreign_selections[foreign_db]=wid_selections[i];
			}
		}
		res.master=this.wid2dbid(wid[0]);
		return res;
	}
	,get:function(pcode,dbid) {
		var pd=this.load(dbid);
		if (!pd) return;
		return pd.getPayload(pcode);
	}
	,getDBName:function(dbid,externalid) {
		var pd=this.load(dbid);
		if (!pd) return;
		return pd.getDBName(externalid);
	}
	,onNewParadigm:function(wid_selections,payload) {
		var res=this.parseSelection(wid_selections);
		if (!res) return;
		master=this.load(res.master);
		for (var i in res.foreign_selections)	this.load(i);
		var pcode=master.createBySelections(res.master_selections,res.foreign_selections,payload);

		actions_pnode.open(pcode,res.master);
	}
})
module.exports=store_paradigm;

/*
var i=fromvpos;
while (i<tovpos){
	var length=Math.floor(Math.random()*5)+1;
	var offset=i*256;
	out.push([offset, offset+length*256, offset, {caption:"m"+c}  ] );
	c++;
	skip=Math.floor(Math.random()*100);
	i+=skip;
}
*/
