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
		,depth:React.PropTypes.number
		,caretPos:React.PropTypes.number
		,self:React.PropTypes.number
	}
	,getDefaultProps:function(){
		return {caretPos:0,depth:0}
	}
	,getInitialState:function() {
		return {pnode:this.props.pnode,editing:-1};
	}
	,openRel:function(e) {
		var pitem=this.props.pnode[e.target.parentNode.dataset.n];
		if (typeof pitem==="number") {
			pitem=-pitem;
		} else if (typeof pitem[0]==="number") {
			pitem[0]=-pitem[0];
		}

		this.props.pnode[e.target.parentNode.dataset.n]=pitem;
		e.stopPropagation();
		this.forceUpdate();
	}
	,renderPNode:function(dbid,pnode,opened,pcode,idx) {
		var children=null,extra=null;
		var rcaption=pnode[0].caption;
		if (opened){
			extra=" ";
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 1px darkblue"};
			children=E(Relation,{depth:this.props.depth+1, pnode:pnode,dbid:dbid,self:this.props.self} );
		} else {
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 2px blue"};

		}
		var expander=E("span",{onClick:this.openRel, style:relbtnstyle},rcaption);
		return E("span",{"data-pcode":pcode,"data-n":idx,key:"k"+idx,contentEditable:false,readOnly:true}
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

			if (pcode<0) {
				opened=true;
				pcode=-pcode;
			}
			var pnode=store_paradigm.get( pcode , dbid);
			var extra=null,children=null;
			var expander=null;
			if (pnode) {
				if (pcode%256==0 && this.props.depth<MAXVISIBLEDEPTH) {
					return this.renderPNode(dbid,pnode,opened,pcode,idx);
				} else {
					var caption=pnode[0].caption;
					if (this.props.self==pcode) {
						return E("span",{key:"k"+idx,"data-n":idx,},"～");
					} else {
						//final node, a span or a pnode depth > MAXVISIBLEDEPTH
						return E("span",{"data-pcode":pcode,"data-n":idx,style:spanbtnstyle,
							key:"k"+idx,onClick:this.openpnode},caption);
					}
				}
			} else {
				return E("span",{key:"k"+idx,"data-pcode":pcode, "data-n":idx,"style":spanbtnstyle,"contentEditable":false},pcode);
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
