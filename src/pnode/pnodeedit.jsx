var Reflux=require("reflux");
var React=require("react");
var action_pnode=require("../actions/pnode");
var action_paradigm=require("../actions/paradigm");
var Relation=require("./embedded_relation.jsx");
//var testdata=require("./propedit_testdata");
//var editing_rel=testdata.forward[1];
//number , a span
//object , a rel
//string , normal text
var E=React.createElement;
var store_paradigm=require("../stores/paradigm");
var RelationDropdown=require("./relation_dropdown.jsx");
var editing_rel=[{caption:"editing r"}, 512, "b",512, "c", 516 ,"d", 145153,"x"];
//var relbtnstyle={cursor:"pointer",borderBottomStyle:"double",color:"blue"};
var dragobject=require("./drag");


var html2pcode=function(div,old) {
	var nodes=div.childNodes;
	var out=[ old[0] ];
	for (var i=0;i<nodes.length;i++) {
		var node=nodes[i];
		if (node.dataset && node.dataset.pcode) {
			out.push(parseInt(node.dataset.pcode));
		} else if (node.nodeName=="#text") {
			out.push(node.nodeValue);
		} else {
			out.push(node.innerText);
		}
	}
	return out;
}
var PNodeEdit=React.createClass({
	getInitialState:function() {
		return {caretPos:0}
	}
	,addSpan:function(n,at,text) {
		var s=editing_rel[n];
		var span=dragobject.start*256+dragobject.len;

		//if (!this.state.relations[span]) this.state.relations[span]=[{caption:text}];

		if (at==0) {
			editing_rel.splice(n-1,0,span," ");
		} else if (at==s.length-1) {
			editing_rel.splice(n,0,span," ");
		} else {
			s2=s.substr(at);
			editing_rel.splice(n+1,0,span," ",s2);
			editing_rel[n]=s.substr(0,at);
		}
		this.forceUpdate();
	}
	,reldragend:function(e) {
		e.target.classList.remove("dragging");
	}
	,keydown:function(e) {
		e.preventDefault();
	}
	,drop:function(e) {
		e.preventDefault();
		/* prevent drop on same relation*/

		var range=document.caretRangeFromPoint(e.clientX,e.clientY);
		if (range.startContainer.nodeName!=="#text") return;
		var at=range.startOffset;
		var data = e.dataTransfer.getData("text");
		//relations.add
		var n=parseInt(range.startContainer.parentNode.dataset.n);
		if (n) this.addSpan(n,at,data)
		dragobject.dragging=false;
	}
	,allowdrop:function(e) {
		if (e.target!=this.refs.body.getDOMNode()) {
			e.stopPropagation();
			return;
		}
	}
	,reldragstart:function(e) {
		console.log("rel dragstart");
    	e.dataTransfer.setData("text", "QQQ");
    	e.target.classList.add("dragging");
    	this.dragging=e.target;

	}
	,componentDidMount:function() {
		this.refs.body.getDOMNode().contentEditable="true";
		action_paradigm.getRelations();
	}
	,close:function() {
		action_pnode.closePNode(this.props.data);
	}
	,captionkeydown:function(e) {
		if (e.key=="Enter") {
			editing_rel[0].caption=e.target.innerText.substring(0,10);
			e.preventDefault();
			this.forceUpdate();
		}
	}
	,render:function(){
		//var relationstatic=React.renderToStaticMarkup();
		return <div className="panel panel-default">
			<div className="panel-heading">
				<h3 className="panel-title" draggable="true"
				 onDragEnd={this.reldragend} onDragStart={this.reldragstart} >
				    <span onKeyDown={this.captionkeydown} contentEditable={true} title="dragable">{editing_rel[0].caption}</span>
					<a href="#" onClick={this.close} className="pull-right btn btn-xs btn-link closebutton">{"\u2613"}</a>
				    <span className="pull-right"><RelationDropdown/></span>
				</h3>
			</div>
			<div ref="body" onKeyDown={this.keydown} onKeyUp={this.keyup} onInput={this.oninput} onBlur={this.onblur}
			 onPaste={this.onpaste} onCut={this.oncut} spellCheck={false}  onDrop={this.drop} onDragOver={this.allowdrop}
			 className="panel-body" style={{display:"inline-block",lineHeight:"165%"}}>
			 <Relation rel={editing_rel} depth={0} caretPos={this.state.caretPos}/>
			 </div>
		</div>
	}
	//dangerouslySetInnerHTML={{__html:relationstatic}}/>
});
module.exports=PNodeEdit;
