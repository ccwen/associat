var React=require("react");
var Container_link=require("./container_link.jsx");
var Container_textview=require("./Container_textview.jsx");
var Perdb=React.createClass({
	getInitialState:function() {
		return {};
	}
	,render:function(){
		//need clearfix here
		return <div className="clearfix">
				<Container_textview db={this.props.db}/>
		</div>
	}
});
module.exports=Perdb;