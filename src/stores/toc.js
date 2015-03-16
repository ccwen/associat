var Reflux=require("reflux");
var action_toc=require("../actions/toc");
var kde=require("ksana-database");
var buildToc=require("ksana2015-treetoc").buildToc;
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
  ,genToc:function(rawtoc, vposs) {
    var out=[];
    for (var i=0;i<rawtoc.length;i++) {
      var t=rawtoc[i];
      var dot=t.indexOf(".");
      var depth=parseInt(t);
      out.push({d:depth,t:t.substring(dot+1),vpos:vposs[i]});
    }
    return out;
  }
  ,onClose:function(n) {
    if (typeof n==="object") {
      n=this.tocs.indexOf(n);
    }
    if (n==-1) return;

    this.tocs.splice(n,1);
    this.trigger(this.tocs);
  }
  ,onOpen:function(dbid,tocid) {
    if (this.exists(dbid,tocid)>-1) return;
    var that=this;
    kde.open(dbid,function(err,db){
      if (err) {
        console.error(err);
        return;
      }
      db.get(["extra",tocid],{recursive:true},function(data){
        db.get(["fields",data.tag],{recursive:true},function(field){
          var toc=that.genToc(data.toc,field.vpos); //continous kepan, don't need to use n
          if (toc[0].d!==0) toc.unshift({d:0,t:tocid});
          toc=buildToc(toc);
          that.tocs.push({id:data.tag,name:tocid,db:db,toc:toc});
          that.trigger(that.tocs);
        });
      });
    });
  }
});
module.exports=store_toc;
