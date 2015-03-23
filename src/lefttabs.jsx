var React=require("react");
var SelectionStatus=require("./selectionstatus.jsx");
var TocTrees=require("./toctrees.jsx");
var FileControls=require("./filecontrols.jsx");
var LeftTabs=React.createClass({
	render:function(){
		return <div>
			<FileControls/>
			<TocTrees/>
				<SelectionStatus/>
		</div>
	}
});
module.exports=LeftTabs;
