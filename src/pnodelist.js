var React=require("react");
var PNodeList=React.createClass({

	render:function() {
		var rows={a:<span>aa</span> , b:<span>bb</span>}
		return <div>{rows}</div>
	}
})
module.exports=PNodeList;