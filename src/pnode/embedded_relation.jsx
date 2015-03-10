var React=require("react");
var Reflux=require("reflux");
var textstyle={cursor:"auto"};
var spanbtnstyle={cursor:"pointer",borderBottom:"solid 2px blue"};

var action_syntag=require("../actions/syntag");
var action_paradigm=require("../actions/paradigm");

var store_paradigm=require("../stores/paradigm");
var RelationTextEdit=require("./relation_textedit.jsx");
var MAXVISIBLEDEPTH=4;
var E=React.createElement;

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
	propTypes:{
		pnode:React.PropTypes.array.isRequired
		,dbid:React.PropTypes.string.isRequired
		,depth:React.PropTypes.number.isRequired
		,caretPos:React.PropTypes.number
	}
	,getInitialState:function() {
		return {pnode:this.props.pnode,editing:-1};
	}
	,openRel:function(e) {
		this.props.rel[e.target.parentNode.dataset.n]=-this.props.rel[e.target.parentNode.dataset.n];
		e.stopPropagation();
		this.forceUpdate();
	}
	,renderPNode:function(dbid,pnode,opened,pcode,idx) {
		var children=null,extra=null;
		var rcaption=rel[0].caption;
		var draggable=this.props.depth==0;
		if (opened){
			extra=" ",
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 1px darkblue"};
			children=E(Relation,{depth:this.props.depth+1, pnode:pnode,dbid:dbid} );
		} else {
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 2px blue"};

		}
		var expander=E("span",{onClick:this.openRel, style:relbtnstyle},rcaption);
		return E("span",{"data-pcode":pcode,"data-n":idx,draggable:draggable,key:"k"+idx,contentEditable:false,readOnly:true}
						, expander, extra,
						children,extra);
	}
	,openpnode:function(e) {
		var pcode=e.target.dataset.pcode;
		action_syntag.goSegByVpos("ds",Math.floor(pcode/256));
	}
	,setCaretPos:function(caretpos) {
		var el=this.getDOMNode();
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(el.childNodes[caretpos], 0);
		range.setEnd(el.childNodes[caretpos], 1);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
	,componentDidUpdate:function() {
		if (this.props.caretPos) {
			this.setCaretPos(this.props.caretPos);
		}
	}
	,edittext:function(e) {
		this.setState({editing:parseInt(e.target.dataset.n)});
	}
	,doneedit:function(text) {
		var pnode=this.state.pnode;
		pnode[this.state.editing]=text;
		this.setState({pnode:pnode,editing:-1});
	}
	,renderItem:function(item,idx) {
		if (idx==0) return;
//dangerouslySetInnerHTML={{__html:item}}/>
		if (typeof item=="string") {
			item=item.replace(/\n/g,"<br/>");
			if (this.state.editing==idx && this.props.depth==0) {
				return <RelationTextEdit key={"k"+idx} text={item} onFinish={this.doneedit}/>
			} else {
				return <span onClick={this.edittext} key={"k"+idx} data-n={idx} style={textstyle} >{item}</span>
			}
		} else {
			var opened=false;
			var pcode=item;
			var dbid=this.props.dbid;
			if (item[1]) {
				pcode=item[0];
				dbid=store_paradigm.getDBName(this.props.dbid,item[1]);
			}

			if (pcode<0) opened=true;
			var pnode=store_paradigm.get( pcode , dbid);
			var extra=null,children=null;
			var expander=null;
			var draggable=this.props.depth==0;
			if (pnode) {
				if (Math.abs(item)%256==0 && this.props.depth<MAXVISIBLEDEPTH) {
					return this.renderPNode(dbid,pnode,opened,pcode,idx);
				} else {
					//final node, a span or a pnode depth > MAXVISIBLEDEPTH

					return E("span",{"data-pcode":item,"data-n":idx,style:spanbtnstyle,
						key:"k"+idx,onClick:this.openpnode, draggable:draggable,contentEditable:false,readOnly:true},pnode[0].caption);
				}
			} else {
				return E("span",{key:"k"+idx,"data-pcode":item, draggable:draggable,"data-n":idx,"style":spanbtnstyle,"contentEditable":false},Math.abs(item));
			}
		}
	}
	,render:function(){
		return <span style={styleFromDepth(this.props.depth)}>
		{this.props.pnode.map(this.renderItem)}
		</span>
	}

});

module.exports=Relation;
