var Pnode=require("./pnode");

var Container_link=React.createClass({
	propTypes:{
		db:React.PropTypes.string.isRequired
	}
	,getInitialState:function() {
		return {links:
			[
			{name:"x",payload:{},
				pcode:[2,3,5] },
			{name:"y",payload:{},
				pcode:[2,3,5]}
			] 
		 }
	}
	,renderLink:function(link,idx){
		return <Pnode key={"k"+idx} link={link}/>
	}
	,shouldComponentUpdate:function() {
		return false;
	}
	,render:function(){
		return 	<div className="panel panel-default">
	    			<div className="panel-heading" role="tab">
	      				<h4 className="panel-title">Links</h4>
	      			</div>
	      			<div className="panel-body">
						{this.state.links.map(this.renderLink)}
					</div>
				</div>
	}
});
module.exports=Container_link;