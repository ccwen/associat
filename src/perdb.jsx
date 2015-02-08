var Container_link=require("./container_link.jsx");
var Container_textview=require("./Container_textview.jsx");
var Perdb=React.createClass({
	getInitialState:function() {
		return {};
	}
	,render:function(){
		//need clearfix here
		return <div className="clearfix">
		    <div className="col-sm-5">
		    	<h3>{this.props.db}</h3>
		    	<Container_link db={this.props.db}/>
			</div>
			<div className="col-sm-5">
				<Container_textview db={this.props.db}/>
			</div>
		</div>
	}
});
module.exports=Perdb;