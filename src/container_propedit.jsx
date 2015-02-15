var React=require("react");
//var testdata=require("./propedit_testdata");
//var editing_rel=testdata.forward[1];
//number , a span
//object , a rel
//string , normal text
var E=React.createElement;
var relations={
	6: [ {caption:"R2"} ,"c1", 252, "c2"]
	,7: [{caption:"R1"} ,"b1", 6 , "b2",6]
}
var editing_rel=[{caption:"editing r"}, "a1xyzxyz",7, "qq",516 ,"a2xyzxyz"];
var relbtnstyle={cursor:"pointer",color:"blue"};
var spanbtnstyle={cursor:"pointer",borderBottomStyle:"double",borderColor:"blue"};
var textstyle={cursor:"auto"};
var dragobject=require("./drag");
//var velocity=require("velocity-animate/velocity.min.js");
//require("velocity-animate/velocity.ui.js");

var styleFromDepth=function(depth) {
	var color="#ffffff";
	if (depth==1) {
		color="#cfcfcf";
	} else if (depth==2) {
		color="#8f8f8f";
	} else if (depth==3) {
		color="#6f6f6f";
	}
	return {borderRadius:"5px",background:color};
}

var Relation=React.createClass({
	openRel:function(e) {
		this.props.rel[e.target.parentNode.dataset.n]=-this.props.rel[e.target.parentNode.dataset.n];
		e.stopPropagation();
		this.forceUpdate();
	}
	,renderItem:function(item,idx) {
		if (idx==0) return;

		if (typeof item=="string") {
			return <span key={"k"+idx} data-n={idx} style={textstyle} dangerouslySetInnerHTML={{__html:item}}/>	
		} else if (typeof item==="number") {
			var opened=false;
			if (item<0) {
				opened=true;
			}
			var rel=relations[Math.abs(item)];
			var extra="",children=null;
			if (rel) {
				var rcaption=rel[0].caption+"+";
				if (opened){
					extra=" ",
					relbtnstyle={cursor:"pointer",textDecoration:"underline",color:"darkblue"};
					children=<Relation depth={this.props.depth+1} rel={rel} />
					rcaption=rel[0].caption+"-";
				} else {
					relbtnstyle={cursor:"pointer",color:"blue"};
				}
				return E("span",{"data-pcode":item,"data-n":idx,key:"k"+idx,contentEditable:false,readOnly:true}
						, E("a",{onClick:this.openRel
						, style:relbtnstyle},rcaption), extra,
						children,extra);
			} else {
				return <span key={"k"+idx} data-pcode={item} data-n={idx} style={spanbtnstyle}>{Math.abs(item)}</span>
			}
		}
	}
	,render:function(){
		return <span style={styleFromDepth(this.props.depth)}>
		{this.props.rel.map(this.renderItem)}
		</span>
	}
	
});
var html2pcode=function(div,old) {
	var nodes=div.children;
	var out=[ old[0] ];
	for (var i=0;i<nodes.length;i++) {
		var node=nodes[i];
		if (node.dataset.pcode) {
				out.push(parseInt(node.dataset.pcode));
		} else {
			var s=node.innerText.replace(/\n/g,function(){return "<br/>"});
			out.push(s);
		}
	}
	console.log(out)
	return out;
}
var Container_propedit=React.createClass({
	toggleedit:function(e) {
		var body=this.refs.body.getDOMNode();
		body.contentEditable=body.contentEditable!=="true"?"true":"false";
		if (body.contentEditable==="true") {
			body.focus();
		}
	}
	,oninput:function(e) {
		var body=this.refs.body.getDOMNode();
		editing_rel=html2pcode(body.children[0],editing_rel);
		console.log(editing_rel)
	}
	,addSpan:function(n,at,text) {
		var s=editing_rel[n];
		var span=dragobject.start*256+dragobject.len;
		if (at==0) {
			editing_rel.splice(n-1,0,span);
		} else if (at==s.length-1) {
			editing_rel.splice(n,0,span);
		} else {
			s2=s.substr(at);
			editing_rel.splice(n+1,0,span,s2);
			editing_rel[n]=s.substr(0,at);
		}
		this.forceUpdate();
	}
	,drop:function(e) {
		e.preventDefault();
		var range=document.caretRangeFromPoint(e.clientX,e.clientY);
		if (range.startContainer.nodeName!=="#text") return;
		var at=range.startOffset;
		var data = e.dataTransfer.getData("text");
		var n=parseInt(range.startContainer.parentNode.dataset.n);
		if (n) this.addSpan(n,at,data)
		dragobject.dragging=false;		
	}
	,allowdrop:function(e) {
		if (!e.target!=this.refs.body.getDOMNode()) {
			e.stopPropagation();
			return;
		}
	}
	,componentDidMount:function() {
		this.refs.body.getDOMNode().contentEditable="true";
	}
	,render:function(){
		return <div className="panel panel-default">
			<div className="panel-heading">
				<h3 className="panel-title">{editing_rel[0].caption}
					<input type="checkbox" onClick={this.toggleedit} className="pull-right btn btn-xs btn-warning"/>
				</h3>				
			</div>
			<div ref="body" onInput={this.oninput} onDrop={this.drop} 
			onDragOver={this.allowdrop} spellCheck="false" 
			className="panel-body" style={{display:"inline-block"}}>
				<Relation rel={editing_rel} depth={0}/>
			</div>
					
		</div>
	}
});
module.exports=Container_propedit;