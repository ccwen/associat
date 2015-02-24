var React=require("react");
var Container_pnodeedit=require("./container_pnodeedit.jsx");
var Container_selection=require("./container_selection.jsx");
var Container_controlpanel=require("./container_controlpanel.jsx");
var styles={
	height:"100%"
	,overflowY:"auto"
}
var Container_rightpanel=React.createClass({
	render:function(){
		return <div style={styles} >
			<Container_controlpanel/>
			<Container_selection/>
			<Container_pnodeedit/>
		</div>
	}
});
module.exports=Container_rightpanel;