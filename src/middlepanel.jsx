var React=require("react");
var MiddleControl=require("./middlecontrol.jsx");
var C_syntagedit=require("./c_syntagedit.jsx");

var MiddlePanel=React.createClass({
	componentDidMount:function() {
		this.refs.container.getDOMNode().style.height
		  =this.getDOMNode().offsetHeight-34;
	}
	,render:function(){
		return <div style={{height:"100%"}}>
			<div ref="controls"><MiddleControl/></div>
			<div ref="container" style={{overflowY:"auto"}}><C_syntagedit/></div>
		</div>
	}
});
module.exports=MiddlePanel;