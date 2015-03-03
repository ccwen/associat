var React=require("react");
var MiddleControl=require("./middlecontrol.jsx");
var Syntags=require("./syntag/syntags.jsx");

var MiddlePanel=React.createClass({
	componentDidMount:function() {
		this.refs.container.getDOMNode().style.height
		  =this.getDOMNode().offsetHeight-34;
	}
	,render:function(){
		return <div style={{height:"100%"}}>
			<div ref="controls"><MiddleControl/></div>
			<div ref="container" style={{overflowY:"auto"}}><Syntags/></div>
		</div>
	}
});
module.exports=MiddlePanel;