var Container_link=React.createClass({
	propTypes:{
		name:React.PropTypes.string.isRequired
		,db:React.PropTypes.string.isRequired
	}
	,renderAccordion:function(name){
		return  <div className="panel panel-default">
	    <div className="panel-heading" role="tab">
	      <h4 className="panel-title">
	        <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href={"#"+name} aria-controls={name}>
	          links
	        </a>
	      </h4>
	    </div>
	    <div id={name} className="panel-collapse collapse in" role="tabpanel" aria-labelledby={name}>
	      <div className="panel-body">
	      	.......
	      </div>
		</div>
		</div>
	}
	,render:function(){
		return 	<div className="panel-group" id={this.props.db+"_accordion"} role="tablist">
				{this.renderAccordion(this.props.db+"_forward")}
				{this.renderAccordion(this.props.db+"_backward")}
			</div>
	}
});
module.exports=Container_link;