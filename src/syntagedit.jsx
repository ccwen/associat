var React=require("react");
var SyntagControl=require("./syntagcontrol.jsx");
var SyntagEdit=React.createClass({
	propTypes:{
		db:React.PropTypes.object.isRequired
		,id:React.PropTypes.string.isRequired
		,setting:React.PropTypes.object.isRequired
		,height:React.PropTypes.number
	}
	,
	getDefaultProp:function(){
		return {height:200}
	}
	,render:function() {

		return <div style={{height:this.props.height+"px"}} className={"panel panel-"+this.props.setting.panel}>
			<div className="panel-heading">
				<div style={{fontSize:"50%"}}>{this.props.setting.caption}<SyntagControl db={this.props.db} id={this.props.id} /></div>
			</div>
			<div className="panel-body">
			</div>			
		</div>
	}
});
module.exports=SyntagEdit;