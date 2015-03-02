var Reflux=require("reflux");
var actions=require("./action_database");
var kde=require("ksana-database");
var store_database=Reflux.createStore({
	listenables:actions,
	databases:[]
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
		}
	}
	,onOpendb:function(dbname,insertAt) {
		kde.open(dbname,function(err,db){
			if (!db) return;
			var key=db.dbname+".0";
			if (typeof insertAt=="undefined") { //open freely
				var at=this.exists(db);
				if (at>-1) {
					key=this.databases[at][0];
					this.databases.splice(at,1); //remove opened
				}
				this.databases.unshift([key,db]);
			} else { //user specified an insert point
				key=this.getNewKey(dbname);
				this.databases.splice(insertAt,0,[key,db]);
			}
			this.trigger(this.databases);
		},this);
	}

});

module.exports=store_database;