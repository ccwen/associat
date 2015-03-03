var React=require("react");
var E=React.createElement;

var SyntagEvents=React.createClass({
	propTypes:{
		children:React.PropTypes.array.isRequired
		,style:React.PropTypes.object.isRequired
		,selections:React.PropTypes.object.isRequired
	}
	,mixins:[require("./clipboard_mixin"),require("./dragndrop_mixin"),
			require("./mouse_mixin"),require("./keyboard_mixin")]
	,render:function() {
		return E("div",{
			style:this.props.style,
			onDrop:this.ondrop,
			onKeyDown:this.onkeydown,
			onKeyUp:this.onkeyup,
			onKeyPress:this.onkeypress,
			onCut:this.oncut,
			onPaste:this.onpaste,
			onCopy:this.oncopy,
			onMouseUp:this.onmouseup,
			onMouseDown:this.onmousedown
		},this.props.children);
	}
});
module.exports=SyntagEvents;
	