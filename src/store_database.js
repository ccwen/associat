var Reflux=require("reflux");
var actions=require("./action_database");
var kde=require("ksana-database");
var store_database=Reflux.createStore({
	listenables:actions,
	databases:[]
	,exists:function(db) {
		for (var i=0;i<this.databases.length;i++) {
			if (this.databases[i]===db) return i;
		}
		return -1;
	}
	,onOpendb:function(dbname,insertAt) {
		kde.open(dbname,function(err,db){
			if (!db) return;

			if (typeof insertAt=="undefined") { //open freely
				var at=this.exists(db);
				if (at>-1) this.databases.splice(at,1); //remove opened
				this.databases.unshift(db);
			} else { //user specified an insert point
				this.databases.splice(insertAt,0,db);
			}
			this.trigger(this.databases);
		},this);
	}

});

module.exports=store_database;