var React=require("react");
var SyntagControl=require("./syntagcontrol.jsx");
var ScrollSyntag=require("./scrollsyntag.jsx");
var action_paradigm=require("../actions/paradigm");
var SyntagEdit=React.createClass({
	propTypes:{
		db:React.PropTypes.object.isRequired
		,wid:React.PropTypes.string.isRequired
		,setting:React.PropTypes.object.isRequired
		,opts:React.PropTypes.object.isRequired
		,height:React.PropTypes.number
		,onFirstVisiblePageChanged:React.PropTypes.func
	}
	,onVisiblePageChanged:function(wid,from,to) {
		if (wid!=this.props.wid) return;
		if (from===this.from && to===this.to) return;
		this.from=from;
		this.to=to;
		var segOffsets=this.props.db.get("segoffsets");
		var fromvpos=segOffsets[from];
		var tovpos=segOffsets[to];
		action_paradigm.setVisibleRange(this.props.db.dbname,fromvpos,tovpos);
	}
	,getDefaultProp:function(){
		return {height:200};
	}
	,render:function() {
		return <div style={{height:this.props.height+"px"}} className={"panel panel-"+this.props.setting.panel}>
			<div ref="heading" className="panel-heading">
				<div style={{fontSize:"50%"}}>{this.props.setting.caption}<SyntagControl db={this.props.db} wid={this.props.wid} /></div>
			</div>
			<div ref="body" style={{overflowY:"auto",height:(this.props.height-41)+"px"}} className="panel-body">
				<ScrollSyntag wid={this.props.wid} db={this.props.db} opts={this.props.opts}
					onFirstVisiblePageChanged={this.props.onFirstVisiblePageChanged}
					onVisiblePageChanged={this.onVisiblePageChanged}/>
			</div>
		</div>
	}
});
module.exports=SyntagEdit;
