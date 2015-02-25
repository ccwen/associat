var React=require("react");
var Reflux=require("reflux");
var action_pnode=require("./action_pnode");
var store_pnode=require("./store_pnode");
var PNodeEdit=require("./pnodeedit");

var Container_pnodeedit=React.createClass({
	mixins:[Reflux.listenTo(store_pnode,"onStorePNode")]
	,getInitialState:function() {
		return {pnodes:[]}
	}
	,onStorePNode:function(pnodes){
		this.setState({pnodes:pnodes});
	}
	,renderPnode:function(item,idx){
		return <PNodeEdit key={"i"+idx} data={item} />
	}
	,newrelation:function() {
		action_pnode.createPNode();
	}
	,render:function() {
		return <div>
			<div><button onClick={this.newrelation} className="btn btn-primary">New Relation</button></div>
			{this.state.pnodes.map(this.renderPnode)}
		</div>
	}
});
module.exports=Container_pnodeedit;