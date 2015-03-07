var React=require("react");
var RightControls=require("./rightcontrols.jsx");
var PNodes=require("./pnode/pnodes.jsx");
var RightPanel=React.createClass({
	componentDidMount:function() {
		this.refs.container.getDOMNode().style.height
		  =this.getDOMNode().offsetHeight-34;
	}
	,render:function(){
		return <div style={{height:"100%"}}>
			<div ref="controls"><RightControls/></div>
			<div ref="container" style={{overflowY:"auto"}}><PNodes/></div>
		</div>
	}
});

module.exports=RightPanel;
