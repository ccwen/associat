var React=require("react");
var action_dataview=require("../actions/dataview");
var KepanSelector=require("./kepanselector.jsx");
var SyntagControl=React.createClass({
	propTypes:{
		db:React.PropTypes.object.isRequired
		,wid:React.PropTypes.string.isRequired
	}
	,close:function() {
		action_dataview.close(this.props.wid);
	}
	,render:function(){
		return <span>
			<a href="#" onClick={this.close} className="pull-right btn btn-xs btn-link closebutton">{"\u2613"}</a>
				<span className="pull-right"><KepanSelector db={this.props.db}/></span>
		</span>
	}
});

module.exports=SyntagControl;
