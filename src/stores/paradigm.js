/*
  relations in memory, sync access.
  prefetch from (pouchdb) async
*/

var Reflux=require("reflux");
var actions=require("../actions/paradigm");
var actions_pnode=require("../actions/pnode");
var actions_selection=require("../actions/selection");
var Paradigm=require("ksana-paradigm");
var debug=false;

var createBySelections=function(selections,foreign_selections,payload,opts) {
	var args=[];
	opts=opts||{};
	args.push(payload||{caption:opts.caption|| "*"+(this.relationCount+1)});

	for (var i=0;i<selections.length;i++) {
		var sel=selections[i];
		if (sel[1]>0) { //span
			this.setSpanCaption(sel[0],sel[1],sel[2]);
			args.push( this.pcodeFromSpan(sel[0],sel[1]) )
		} else { //rel
			args.push([sel[0],0]);
		}

		args.push(sel[3]||opts.desc||"…"); //place holder for description
	}

	for (var j in foreign_selections) {
		var ext=this.getExternal(j);
		var sels=foreign_selections[j];
		for (var k=0;k<sels.length;k++) {
			var sel=sels[k];
			if (sel[1]>0) { //span
				ext.setSpanCaption(sel[0],sel[1],sel[2]);
				args.push( this.pcodeFromSpan(sel[0],sel[1],j) );
			} else {
				args.push( this.externalPCode(sel[0], j ) );
			}
			args.push(sel[3]||opts.desc||"…"); //place holder for description
		}
	}
	return this.addRel.apply(this,args);
}

var store_paradigm=Reflux.createStore({
	listenables:actions
	,barrels:{}
	,visibleRanges:{}
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
	,onSetVisibleRange:function(dbname,fromvpos,tovpos) {
		if (debug)	console.log("setvisible range of ",dbname);
		//  each item: [start_offset,end_offset, pcode, pnode]

		var pd=this.barrels[dbname];
		if (!pd) return;
		var out=pd.filterByVpos(fromvpos,tovpos);

		this.visibleRanges[dbname]=[fromvpos,tovpos];
		this.trigger(dbname,out);
	}
	,wid2dbid:function(wid) {
		var i=wid.lastIndexOf("_");
		return wid.substr(0,i);
	}
	,parseSelection:function(wid_selections) {
		// first key in wid_selections is master db, the rest are foreign
		var wid=Object.keys(wid_selections);
		if (wid.length==0) return null;
		var res={ master:this.wid2dbid(wid[0]) , master_selections:null,foreign_selections:null };

		for (var i in wid_selections) {
			if (i==wid[0]) {
				res.master_selections=wid_selections[i];
			} else {
				var foreign_db=this.wid2dbid(i);
				if (foreign_db===res.master) {
					res.master_selections=res.master_selections.concat(wid_selections[i]);
				} else {
					if (!res.foreign_selections) res.foreign_selections={};
					res.foreign_selections[foreign_db]=wid_selections[i];
				}
			}
		}
		return res;
	}
	,get:function(pcode,dbid) {
		var pd=this.load(dbid);
		if (!pd) return;
		return pd.get(pcode);
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
		var pcode=createBySelections.call(master,res.master_selections,res.foreign_selections,payload);
		actions_pnode.open(pcode,res.master);

		actions_selection.clearSelections();
		for (var dbname in this.visibleRanges) {
			var r=this.visibleRanges[dbname];
			this.onSetVisibleRange(dbname,r[0],r[1]);
		}

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
