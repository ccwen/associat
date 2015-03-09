/*
  relations in memory, sync access.
  prefetch from (pouchdb) async
*/

var Reflux=require("reflux");
var actions=require("../actions/paradigm");
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
	,load:function(db) {
		var relations=localStorage.getItem(db.dbname+"_relations")||"";
		this.barrels[db.dbname]=Paradigm.barrel.loadFromString(db.dbname,relations);
		if (debug) console.log("load markup of db",db.dbname,this.barrels[db.dbname]);
	}
	,save:function(db) {
		localStorage.setItem(db.dbname, this.barrels[db.dbname].saveToString() );
	}
	,saveAll:function() {
		for (var i in this.barrels) this.save(i);
	}
	,onMarkupChanged:function(db,relations) {
		if (this.db && db===this.db) {
			this.relations=relations;
			this.onSetVisibleRange(this.db,this.fromvpos,this.tovpos);
		}
	}
	,onSetVisibleRange:function(db,fromvpos,tovpos) {
		if (debug) console.log("setvisible range of ",db.dbname)
		var out=[],c=0;
		var i=fromvpos;
		while (i<tovpos){
			var length=Math.floor(Math.random()*5)+1;
			var offset=i*256;
			out.push([offset, offset+length*256, offset, {caption:"m"+c}  ] );
			c++;
			skip=Math.floor(Math.random()*100);
			i+=skip;
		}
		this.db=db;
		this.fromvpos=fromvpos;
		this.tovpos=tovpos;
		this.trigger(db,out);
	}
	,onNewParadigm:function(wid_selections,payload) {
		//create span with caption for all selections
		//create a new relation consists of all selections
		//open pnodeedit for the newly created relation
		console.log(wid_selections);
	}
})
module.exports=store_paradigm;
