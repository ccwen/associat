var React=require("react");
var SelectionStatus=require("./selectionstatus.jsx");
var TocTrees=require("./toctrees.jsx");
var LeftTabs=React.createClass({
	render:function(){
		return <div>
			<TocTrees/>
				<SelectionStatus/>
		</div>
	}
});
module.exports=LeftTabs;
