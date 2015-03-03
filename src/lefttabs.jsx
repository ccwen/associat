var React=require("react");
var SelectionStatus=require("./selectionstatus.jsx");
var LeftTabs=React.createClass({
	render:function(){
		return <div>
			<SelectionStatus/>
		</div>
	}
});
module.exports=LeftTabs;