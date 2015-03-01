var React=require("react");
var MiddleControl=require("./middlecontrol.jsx");
var C_syntagedit=require("./c_syntagedit.jsx");

var MiddlePanel=React.createClass({
	render:function(){
		return <div>
			<MiddleControl/>
			<C_syntagedit/>		
		</div>
	}
});
module.exports=MiddlePanel;