var Reflux=require("reflux");
var actions=require("./action_dataview");
var kde=require("ksana-database");
var persistent=require("./persistent");
var store_dataview=Reflux.createStore({
	listenables:actions,
	dataviews:[]
	,_rev:null

	,init:function() {
		var that=this;
		persistent.db.get("dataviews",function(err,doc){
			if (err && err.error) {
				persistent.db.put({dataviews:[]},"dataviews",function(err,response){
					that._rev=response.rev;
				});
			} else {
				that.opendataviews(doc.dataviews,function(){
					setTimeout(function(){
						that.trigger(that.dataviews);
					},100);
				});
				that._rev=doc._rev;
			}
		});
	}
	,updateDb:function() {
		var out=[];
		for (var i=0;i<this.dataviews.length;i++) {
			var d=this.dataviews[i];
			out.push([d[1].dbname,d[2]]); //dbname, opts
		}
		var that=this;
		persistent.db.put({dataviews:out}
			,"dataviews"
			,this._rev,function(err,response){
				if (err) {
					console.log(err);
				} else {
					that._rev=response.rev;
				}

			});
	}
	,exists:function(db) {
		for (var i=0;i<this.dataviews.length;i++) {
			if (this.dataviews[i][1]===db) return i;
		} 
		return -1;
	}
	,existsKey:function(key) {
		for (var i=0;i<this.dataviews.length;i++) {
			if (this.dataviews[i][0]===key) return i;
		}
		return -1;		
	}
	,getNewKey:function(dbname) {
		var i=0;
		do {
			key=dbname+"."+i;
			i++;
		} while (this.existsKey(key)>-1) ;
		return key;
	}
	,onClose:function(key) {
		var i=this.existsKey(key);
		if (i>-1) {
			this.dataviews.splice(i,1);
			this.trigger(this.dataviews);
			this.updateDb();
		}
	}
	,opendb:function(dbname,dbopts,insertAt,cb) {
		kde.open(dbname,function(err,db){
			if (!db) {
				if (cb) cb.call(this,err);
				return;
			}
			dbopts=dbopts||{};
			var key=db.dbname+".0";
			if (typeof insertAt=="undefined") { //open freely
				var at=this.exists(db);
				if (at>-1) {
					key=this.dataviews[at][0];
					this.dataviews.splice(at,1); //remove opened
				}
				this.dataviews.unshift([key,db,dbopts]);
			} else { //user specified an insert point
				key=this.getNewKey(dbname);
				this.dataviews.splice(insertAt,0,[key,db,dbopts]);
			}
			if (cb) cb.call(this);
		},this);
	}
	,opendataviews:function(entries,cb) {
		var that=this,opened=0;
		for (var i=0;i<entries.length;i++) {
			(function(item,idx){
				that.opendb(entries[idx][0],entries[idx][1],idx,function(err){
					opened++;
					if (opened==entries.length) {
						if (cb) cb.call(this);
					}
				});
			}(entries[i],i));
		}
	}
	,onOpen:function(dbname,scrollto,insertAt) {
		this.opendb(dbname,scrollto,insertAt,function(){
			this.trigger(this.dataviews);
			this.updateDb();			
		});
	}
});

module.exports=store_dataview;