var Reflux=require("reflux");
var actions=require("./action_database");
var kde=require("ksana-database");
var persistent=require("./persistent");
var store_database=Reflux.createStore({
	listenables:actions,
	databases:[]
	,_rev:null

	,init:function() {
		var that=this;
		persistent.db.get("databases",function(err,doc){
			if (err && err.error) {
				persistent.db.put({databases:[]},"databases",function(err,response){
					that._rev=response.rev;
				});
			} else {
				that.openDatabases(doc.databases,function(){
					setTimeout(function(){
						that.trigger(that.databases);
					},100);
				});
				that._rev=doc._rev;
			}
		});
	}
	,updateDb:function() {
		var out=[];
		for (var i=0;i<this.databases.length;i++) {
			var d=this.databases[i];
			out.push([d[1].dbname,d[2]]); //dbname, scrollto
		}
		persistent.db.put({databases:out}
			,"databases"
			,this._rev,function(err){
				if (err) {
					console.log(err);
				}
			});
	}
	,exists:function(db) {
		for (var i=0;i<this.databases.length;i++) {
			if (this.databases[i][1]===db) return i;
		} 
		return -1;
	}
	,existsKey:function(key) {
		for (var i=0;i<this.databases.length;i++) {
			if (this.databases[i][0]===key) return i;
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
	,onClosedb:function(key) {
		var i=this.existsKey(key);
		if (i>-1) {
			this.databases.splice(i,1);
			this.trigger(this.databases);
			this.updateDb();
		}
	}
	,opendb:function(dbname,scrollto,insertAt,cb) {
		kde.open(dbname,function(err,db){
			if (!db) {
				if (cb) cb.call(this,err);
				return;
			}
			scrollto=scrollto||0;
			var key=db.dbname+".0";
			if (typeof insertAt=="undefined") { //open freely
				var at=this.exists(db);
				if (at>-1) {
					key=this.databases[at][0];
					this.databases.splice(at,1); //remove opened
				}
				this.databases.unshift([key,db,scrollto]);
			} else { //user specified an insert point
				key=this.getNewKey(dbname);
				this.databases.splice(insertAt,0,[key,db,scrollto]);
			}
			if (cb) cb.call(this);
		},this);
	}
	,openDatabases:function(entries,cb) {
		var that=this,opened=0;
		for (var i=0;i<entries.length;i++) {
			(function(item,idx){
				that.opendb(entries[idx][0],entries[idx][1],-1,function(err){
					opened++;
					if (opened==entries.length) {
						if (cb) cb.call(this);
					}
				});
			}(entries[i],i));
		}
	}
	,onOpendb:function(dbname,scrollto,insertAt) {
		this.opendb(dbname,scrollto,insertAt,function(){
			this.trigger(this.databases);
			this.updateDb();			
		});
	}
});

module.exports=store_database;