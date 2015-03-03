/* operation on pnode */

var actions=require("reflux").createActions([
	"createPNode"       //create a PNode from current selection
	,"deletePNode"
	,"modifyPNode"
	,"openPNode"
	,"closePNode"
]);
module.exports=actions;