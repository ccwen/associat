var React=require("react");
var action_toc=require("../actions/toc");

var KepanSelector = React.createClass({
  propTypes:{
    db:React.PropTypes.object.isRequired
  }
  ,getInitialState:function() {
    return {items:[]}
  }
  ,componentDidMount:function() {
    this.props.db.get(["extra"],function(data){
      this.setState({items:Object.keys(data)});
    },this);
  }
  ,opentoc:function(e){
    action_toc.open(this.props.db.dbname,e.target.dataset.tocid);
  }
  ,renderItem:function(item,idx) {
		return <li key={"i"+idx}><a data-tocid={item} onClick={this.opentoc} href="#">{item}</a></li>
	}
	,render:function() {
    if (!this.state.items.length) {
      return <span></span>;
    } else {
      return <span className="btn-group pull-left">
  			  <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
  			    {this.state.items.length?this.state.items.length:""} toc<span className="caret"></span>
  			  </button>
  			  <ul className="dropdown-menu dropdown-menu-right" role="menu">
  			    {this.state.items.map(this.renderItem)}
  			  </ul>
  			</span>

    }
	}
});

module.exports = KepanSelector;
