var React=require("react");
//var testdata=require("./propedit_testdata");
//var editing_rel=testdata.forward[1];
//number , a span
//object , a rel
//string , normal text
var E=React.createElement;
var relations={
	6: [ {caption:"R2"} ,"c1", 252, "c2"]
	,7: [{caption:"R1"} ,"b1", {rel:6}, "b2",{rel:6}]
}
var editing_rel=[{caption:"editing r"}, "a1xyzxyz",{rel:7,label:"r1"}, 516 ,"a2xyzxyz"];
var relbtnstyle={cursor:"pointer"};
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
		var item=this.props.rel[e.target.parentNode.dataset.n];
		item.o=!item.o;
		e.stopPropagation();
		this.forceUpdate();
	}
	,renderItem:function(item,idx) {
		if (typeof item==="number") {
			return <span key={"k"+idx} contentEditable={false} readOnly={true} style={spanbtnstyle}>{item}</span>
		} else if (typeof item=="string") {
			return <span key={"k"+idx} data-n={idx} style={textstyle}>{item}</span>
		} else {
			var opened=null;
			var rel=relations[item.rel];
			if (item.o) {
				opened=<Relation depth={this.props.depth+1} rel={rel} />
			}
			if (!rel) return;
			return E("span",{"data-n":idx,key:"k"+idx,contentEditable:false,readOnly:true}
					, E("a",{onClick:this.openRel
					, style:relbtnstyle},rel[0].caption), 
					opened);
		}
	}
	,render:function(){
		return <span style={styleFromDepth(this.props.depth)}>
		{this.props.rel.map(this.renderItem)}
		</span>
	}
	
})
var Container_propedit=React.createClass({
	toggleedit:function(e) {
		var body=this.refs.body.getDOMNode();
		body.contentEditable=body.contentEditable!=="true"?"true":"false";
		if (body.contentEditable==="true") {
			body.focus();
		}
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
			<div ref="body" onDrop={this.drop} onDragOver={this.allowdrop} spellCheck="false" className="panel-body">
				<Relation rel={editing_rel} depth={0}/>
			</div>
					
		</div>
	}
});
module.exports=Container_propedit;