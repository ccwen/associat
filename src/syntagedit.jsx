var React=require("react");
var SyntagControl=require("./syntagcontrol.jsx");
var SyntagEdit=React.createClass({
	propTypes:{
		db:React.PropTypes.object.isRequired
		,setting:React.PropTypes.object.isRequired
	}
	,render:function() {

		return <div className={"panel panel-"+this.props.setting.panel}>
			<div className="panel-heading">
				<div style={{fontSize:"50%"}}>{this.props.setting.caption}<SyntagControl db={this.props.db}/></div>
			</div>
			<div className="panel-body">
			</div>			
		</div>
	}
});
module.exports=SyntagEdit;