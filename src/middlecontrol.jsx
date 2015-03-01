var React=require("react");
var DatabaseButtons=require("./databasebuttons.jsx");
var MiddleControl=React.createClass({
	render:function(){
		return <div>
			<DatabaseButtons/>
		</div>
	}
});
module.exports=MiddleControl;