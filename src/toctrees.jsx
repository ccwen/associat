var React = require("react");
var Reflux = require("reflux");
var store_toc = require("./stores/toc");
var action_toc = require("./actions/toc");
var action_dataview = require("./actions/dataview");
var TreeToc=require("ksana2015-treetoc").component;
var TocTrees = React.createClass({
  mixins:[Reflux.listenTo(store_toc,"onStoreToc")]
  ,getInitialState:function() {
    return {tocs:[]};
  }
  ,onStoreToc:function(tocs) {
    this.setState({tocs:tocs});
  }
  ,getTocById:function(id) {
    for (var i=0;i<this.state.tocs.length;i++) {
      var t=this.state.tocs[i];
      if (t.id==id) return t;
    }
    return null;
  }
  ,onSelect:function(n,tocid) {
    var t=this.getTocById(tocid);
    var toc=t.toc;
    var db=t.db;
    var start=toc[n].vpos;
    var end=toc[n+1].vpos;
    if (toc[n].n) {
      end=toc[toc[n].n].vpos;
    }

    if (n==toc.length) end=db.get("meta").vsize;
    action_dataview.open(db.dbname,{highlight:[ start,end-start]});
  }
  ,renderToc:function(item,idx) {
    var cls="tab-pane";
    if (idx==0) cls+=" active";
    return <div key={idx} className={cls} id={item.id}>
      <TreeToc opts={{editable:true}} tocid={item.id} data={item.toc} key={idx} onSelect={this.onSelect}/>
    </div>
  }
  ,close:function(e) {
    var n=parseInt(e.target.dataset.n);
    action_toc.close(n);
  }
  ,renderNames:function(item,idx){
    var cls="";
    if (idx==0) cls="active";
    return <li key={idx} className={cls}><a href={"#"+item.id} data-toggle="tab">{item.name}
      <span data-n={idx} href="#" onClick={this.close} className="pull-right btn btn-xs btn-link closebutton">{"\u2613"}</span></a>
      </li> ;
  }
  ,render: function() {
    return (
      <div>
      <ul className="nav nav-tabs">
        {this.state.tocs.map(this.renderNames)}
      </ul>
      <div className="tab-content">
      {this.state.tocs.map(this.renderToc)}
      </div>
    </div>
    );
  }

});

module.exports = TocTrees;
