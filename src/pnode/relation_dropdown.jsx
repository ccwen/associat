var React=require("react");
var action_pnode=require("../actions/pnode");
var Relation_dropdown=React.createClass({
	propTypes:{
			items:React.PropTypes.array.isRequired
			,pd:React.PropTypes.object.isRequired
	}
	,openpnode:function(e) {
		//too low level, should be able to open by [pcode,number_dbid]
		var pcode=this.props.items[parseInt(e.target.dataset.n)];

		if (typeof pcode=="number") {
			action_pnode.open(pcode,this.props.pd.dbid[0]);
		} else {
			var dbid=this.props.pd.getExternal(pcode[1]).dbid[0];
			action_pnode.open(pcode[0],dbid);
		}

	}
	,renderItem:function(item,idx) {
		var rel=this.props.pd.get(item);
		return <li key={"i"+idx}><a data-n={idx} onClick={this.openpnode} href="#">{rel[0].caption}</a></li>
	}
	,render:function() {
		return <div className="btn-group pull-left">
			  <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
			    {this.props.items.length?this.props.items.length:""} pnode<span className="caret"></span>
			  </button>
			  <ul className="dropdown-menu dropdown-menu-right" role="menu">
			    {this.props.items.map(this.renderItem)}
			  </ul>
			</div>
	}
});
module.exports=Relation_dropdown
