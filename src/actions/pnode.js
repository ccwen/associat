/* operation on pnode */

var actions=require("reflux").createActions([
	"create"       //create a PNode from current selection
	,"open"
	,"close"
]);
module.exports=actions;
