var React=require("react");
var C_columns = React.createClass({
	propTypes:{
		sizes:React.PropTypes.array.isRequired
	}
	,shouldComponentUpdate:function(){
		return false;
	}
	,renderItem:function(item,idx) {
		return <div key={"c"+idx} className={"col-md-"+this.props.sizes[idx]}>{item}</div>
	}
	,render:function(){
		return <div>
			{this.props.children.map(this.renderItem)}
		</div>
	}
});

module.exports=C_columns;