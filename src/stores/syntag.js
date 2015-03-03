var Reflux=require("reflux");
var actions=require("../actions/syntag");
var kde=require("ksana-database");
var store_syntag=Reflux.createStore({
	listenables:actions,
	onGoSeg:function(dbname,seg) {
		this.trigger(dbname,seg)
	}
	,onGoSegByVpos:function(dbname,vpos) {
		kde.open(dbname,function(err,db){
			if (err) {
				console.error(err);
				return;
			}
			var seg=db.absSegFromVpos(vpos);
			this.trigger(dbname,seg-1);
		},this);
	}
});
module.exports=store_syntag;