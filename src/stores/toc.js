var Reflux=require("reflux");
var action_toc=require("../actions/toc");
var store_toc=Reflux.createStore({
  listenables:action_toc
  ,tocs:[]
  ,exists:function(dbid,tocid) {
    for (var i=0;i<this.tocs.length;i++) {
      var t=this.tocs[i];
      if (t[0]===dbid && t[1]===tocid) return i;
    }
    return -1;
  }
  ,onOpen:function(dbid,tocid) {
    if (this.exists(dbid,tocid)>-1) return;

    this.tocs.push([dbid,tocid]);
    this.trigger(this.tocs);
  }
});
module.exports=store_toc;
