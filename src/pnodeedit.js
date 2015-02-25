var Reflux=require("reflux");
var React=require("react");
var action_pnode=require("./action_pnode");
var action_relation=require("./action_relation");
var Relation=require("./embedded_relation.jsx");
//var testdata=require("./propedit_testdata");
//var editing_rel=testdata.forward[1];
//number , a span
//object , a rel
//string , normal text
var E=React.createElement;
var store_relation=require("./store_relation");
var RelationDropdown=require("./relation_dropdown.jsx");
var editing_rel=[{caption:"editing r"}, "a",512, "b",512, "c", 516 ,"d", 145153];
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
	,onblur:function(e) {
		console.log("onblur")
		this.forceUpdate();
	}

	,keydown:function(e) {
		var r=window.getSelection().getRangeAt(0);
		var backspacing=(e.key=="Backspace");
		var deleting=(e.key=="Delete");
		var enter=(e.key=="Enter");
		if (enter) {
			e.preventDefault();
			return;
		}


		if ((backspacing || deleting ) && (r.startContainer!=r.endContainer || r.startOffset!=r.endOffset)) {
			e.preventDefault();
			return;
		}

		var n=parseInt(r.startContainer.parentElement.dataset.n);

		if (backspacing && r.startOffset==0 && n>1 && typeof editing_rel[n-1]!="string"){
			editing_rel.splice(n-1,1);
			this.setState({caretPos:n-2});
			e.preventDefault();
			console.log(editing_rel)
			return ;
		}


		if (deleting && r.startOffset==r.startContainer.data.length && n<editing_rel.length
			 && typeof editing_rel[n-1]!="string") {
			editing_rel.splice(n+1,1);
			this.setState({caretPos:n});
			e.preventDefault();
			console.log(editing_rel)
			return ;			
		}
	}
	,keyup:function(e) {
		var r=window.getSelection().getRangeAt(0);
		var nav=( ["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].indexOf(e.key)>-1);
		if (r.startContainer!=r.endContainer || r.startOffset!=r.endOffset) {
			if (!nav)e.preventDefault();
		}


	}
	,oninput:function(e) {
		var editor=this.refs.body.getDOMNode();
		
		editing_rel=html2pcode(editor.children[0],editing_rel);
		if (editing_rel.length==1) {
			editing_rel.push("empty relation");
			this.forceUpdate();
		}
		console.log(editing_rel)
	}
	,oncut:function(e) {
		e.preventDefault();
	}
	,onpaste:function(e) {
		console.log("paste");
    	var text = e.clipboardData.getData("text/plain");
    	document.execCommand("insertHTML", false, text);		
		e.preventDefault();
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
		action_relation.getRelations();
	}
	,close:function() {
		action_pnode.closePNode(this.props.data);
	}
	,render:function(){
		//var relationstatic=React.renderToStaticMarkup();
		return <div className="panel panel-default">
			<div className="panel-heading">
				<h3 className="panel-title" >
				    <span draggable="true" onDragEnd={this.reldragend} onDragStart={this.reldragstart} title="dragable">{editing_rel[0].caption}</span>
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