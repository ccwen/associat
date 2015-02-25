var React=require("react");

var TrashCan=React.createClass({
	ondragover:function(e) {
		console.log("dragover",e.target)
		e.target.classList.add("droppable");
		e.preventDefault();
	}
	,ondragleave:function(e) {
		e.target.classList.remove("droppable")
	}
	,ondrop:function(e) {
		e.target.classList.remove("droppable")
	}
	,render:function() {
		return <span onDragLeave={this.ondragleave} onDrop={this.ondrop} onDragOver={this.ondragover}>TrashCan</span>
	}
})

module.exports=TrashCan;