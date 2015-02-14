var React=require("react");
var Container_propedit=require("./container_propedit.jsx");
var Container_selection=require("./container_selection.jsx");
var Container_controlpanel=require("./container_controlpanel.jsx");
var Container_rightpanel=React.createClass({
	render:function(){
		return <div>
			<Container_controlpanel/>
			<Container_selection/>
			<Container_propedit/>
		</div>
	}
});
module.exports=Container_rightpanel;