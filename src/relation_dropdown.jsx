var React=require("react");
var Relation_dropdown=React.createClass({
	render:function() {
		return <div className="btn-group pull-left">
			  <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
			    used by<span className="caret"></span>
			  </button>
			  <ul className="dropdown-menu dropdown-menu-right" role="menu">
			    <li><a href="#">Action</a></li>
			    <li><a href="#">中文</a></li>
			    <li><a href="#">Something else here</a></li>
			    <li className="divider"></li>
			    <li><a href="#">Separated link</a></li>
			  </ul>
			</div>
	}
});
module.exports=Relation_dropdown