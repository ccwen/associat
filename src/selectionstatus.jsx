var React=require("react");
var Reflux=require("reflux");
var store=require("./stores/selection");

var SelectionStatus=React.createClass({
	mixins:[Reflux.listenTo(store,"onStore")]
	,getInitialState:function() {
		return {selections:[]};
	}
	,onStore:function(selections) {
		this.setState({selections:selections});
	}
	,render:function(){
		return <div>{JSON.stringify(this.state.selections)}</div>
	}
});
module.exports=SelectionStatus;