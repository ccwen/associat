var React=require("react");
var action_dataview=require("./action_dataview");
var SyntagControl=React.createClass({
	propTypes:{
		db:React.PropTypes.object.isRequired
		,id:React.PropTypes.string.isRequired
	}
	,close:function() {
		action_dataview.close(this.props.id);
	}
	,render:function(){
		return <span>controls
			<a href="#" onClick={this.close} className="pull-right btn btn-xs btn-link closebutton">{"\u2613"}</a>
		</span>
	}
});

module.exports=SyntagControl;