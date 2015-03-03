var React=require("react");
//var velocity=require("velocity-animate/velocity.min.js");
//require("velocity-animate/velocity.ui.js");

var Pnode=React.createClass({
	propTypes:{
		link:React.PropTypes.object.isRequired
	}
	,getInitialState:function() {
		return {selected:0}
	}
	,select:function(e) {
		if (this.state.selected==0) velocity(e.target.parentNode,"callout.pulse");
		else if (this.state.selected==1) velocity(e.target.parentNode,"callout.bounce");
		this.setState({selected:this.state.selected==2?0:this.state.selected+1});
	}
	,renderPcode:function(pcode,idx){
		return <span key={"k"+idx}> {pcode}</span>
	}
	,render:function(){
		var extra1="btnlink_clickable",extra="";

		if (this.state.selected==1) {extra1="btnlink_selected";extra="selected_link" }
		else if (this.state.selected==2) {extra1="btnlink_pinned";extra="pinned_link" };

		return <div className={extra}>
		    <span className={"btnpinlink "+extra1} onClick={this.select}>　</span>{this.props.link.name}
			{this.props.link.pcode.map(this.renderPcode)}
			
		</div>
	}
});

module.exports=Pnode;