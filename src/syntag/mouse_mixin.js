var textselection=require("./textselection");
var action_selection=require("../actions/selection");
var mouse_mixin={

	onmouseup:function(e){
      var sel=textselection();  
      var selections=this.props.selections;
      var oldlength=selections.length;
      if (!sel)return;

      action_selection.addSelection(this.props.wid, selections, sel.start,sel.len , e.ctrlKey );
	}
	,onmousedown:function(e) {
		console.log("mousedown")
	}
};

module.exports=mouse_mixin;