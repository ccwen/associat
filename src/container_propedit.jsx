var React=require("react");
//var testdata=require("./propedit_testdata");
//var editing_rel=testdata.forward[1];
//number , a span
//object , a rel
//string , normal text
var E=React.createElement;
var relations={
	516:[{caption:"引用"}]
	,1024:[{caption:"R4"},"aaa",517,"bb"]
	,517:[{caption:"引用2"}]
	,768:[{caption:"R3"},"xxxx",1024,"qqqq"]
	,256: [ {caption:"R2"} ,"c1", 516, "c2", 768]
	,512: [{caption:"R1"} ,"b1", 256 , "b2",256]
}
var editing_rel=[{caption:"editing r"}, "a1xyzxyz",512, "qq",516 ,"a2xyzxyz"];
//var relbtnstyle={cursor:"pointer",borderBottomStyle:"double",color:"blue"};
var spanbtnstyle={cursor:"pointer",borderColor:"blue",textDecoration:"underline"};
var textstyle={cursor:"auto"};
var dragobject=require("./drag");
var MAXVISIBLEDEPTH=4;

var styleFromDepth=function(depth) {
	var out={};
	if (depth) {
		out.padding = (MAXVISIBLEDEPTH-depth)*2+"px";
		out.border="dotted 1px";
		out.borderRadius="5px";
	}
	return out;
}

var Relation=React.createClass({
	openRel:function(e) {
		this.props.rel[e.target.parentNode.dataset.n]=-this.props.rel[e.target.parentNode.dataset.n];
		e.stopPropagation();
		this.forceUpdate();
	}
	,renderRel:function(rel,opened,pcode,idx) {
		var children=null,extra=null;
		var rcaption=rel[0].caption;
		if (opened){
			extra=" ",
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 1px",borderColor:"darkblue"};
			children=<Relation depth={this.props.depth+1} rel={rel} />
		} else {
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 2px",borderColor:"blue"};

		}
		var expander=E("span",{onClick:this.openRel, style:relbtnstyle},rcaption);
		return E("span",{"data-pcode":pcode,"data-n":idx,key:"k"+idx,contentEditable:false,readOnly:true}
						, expander, extra,
						children,extra);
	}
	,openpnode:function(e) {
		var pcode=e.target.dataset.pcode
		console.log("open pnode",pcode);
	}
	,renderItem:function(item,idx) {
		if (idx==0) return;

		if (typeof item=="string") {
			item=item.replace(/\n/g,"<br/>");
			return <span key={"k"+idx} data-n={idx} style={textstyle} 
				dangerouslySetInnerHTML={{__html:item}}/>	
		} else if (typeof item==="number") {
			var opened=false;
			if (item<0) opened=true;
			var rel=relations[Math.abs(item)];
			var extra=null,children=null;
			var expander=null;
			if (rel) {
				if (Math.abs(item)%256==0 && this.props.depth<MAXVISIBLEDEPTH) {
					return this.renderRel(rel,opened,item,idx);
				} else {
					//final node, a span or a rel depth > MAXVISIBLEDEPTH

					return E("span",{"data-pcode":item,"data-n":idx,style:spanbtnstyle,
						key:"k"+idx,onClick:this.openpnode, contentEditable:false,readOnly:true},rel[0].caption);
				}
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
			out.push(node.innerText);
		}
	}
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
		//console.log(editing_rel)
	}
	,addSpan:function(n,at,text) {
		var s=editing_rel[n];
		var span=dragobject.start*256+dragobject.len;

		if (!relations[span]) relations[span]=[{caption:text}];

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
		relations.add
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
			className="panel-body" style={{display:"inline-block",lineHeight:"165%"}}>
				<Relation rel={editing_rel} depth={0}/>
			</div>
					
		</div>
	}
});
module.exports=Container_propedit;