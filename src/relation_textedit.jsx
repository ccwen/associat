var React=require("react");
var Relation_text_editor=React.createClass({
	propTypes:{
		"onFinish":React.PropTypes.func.isRequired
		,"text":React.PropTypes.string.isRequired
	}

	,onkeypress:function(e) {
		if (e.key=="Enter") {
			this.finish(e);
			e.preventDefault();
		}
	}
	,finish:function(e) {
		this.props.onFinish(e.target.value.trim()||" ");
	}
	,onkeydown:function(e) {
		e.stopPropagation();
	}
	,componentDidMount:function(){
		this.getDOMNode().focus();
		this.getDOMNode().setSelectionRange(this.props.text.length,this.props.text.length);
	}
	,render:function() {
		var size=this.props.text.length;
		if (size<4) size=4;
		return <input contentEditable={true} onBlur={this.finish} size={size} onKeyDown={this.onkeydown} defaultValue={this.props.text} onKeyPress={this.onkeypress} />
	}
});

module.exports=Relation_text_editor;