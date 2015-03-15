var React = require("react");
var Reflux = require("reflux");
var PNodeEdit=require("./pnodeedit.jsx");
var store_pnode = require("../stores/pnode");
var PNodes = React.createClass({
  mixins:[Reflux.listenTo(store_pnode,"onStorePNode")]
  ,getInitialState:function() {
    return {pnodes:[]};
  }
  ,onStorePNode:function(data) {
    this.setState({pnodes:data});
  }
  ,renderItem:function(item,idx) {
    return <PNodeEdit key={item[2]+"_"+item[0]} pcode={item[0]} dbid={item[2]} pnode={item[1]} usedby={item[3]||[]}/>
  }
  ,render: function() {
    return (
      <div>{this.state.pnodes.map(this.renderItem)}</div>
    );
  }

});

module.exports = PNodes;
