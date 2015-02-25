var React=require("react");
var Reflux=require("reflux");
var textstyle={cursor:"auto"};
var spanbtnstyle={cursor:"pointer",borderBottom:"solid 2px blue"};
var store_relation=require("./store_relation");
var action_syntag=require("./action_syntag");
var action_relation=require("./action_relation");
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
		rel:React.PropTypes.array.isRequired
		,depth:React.PropTypes.number.isRequired
		,caretPos:React.PropTypes.number		
	}
	,mixins:[Reflux.listenTo(store_relation,"onStoreRelation")]
	,onStoreRelation:function(relations) {
		this.setState({relations:relations})
	}
	,componentDidMount:function() {
		if (Object.keys(this.state.relations).length==0) {
			action_relation.getRelations(); //only top level relation will fetch relations
		}
	}
	,getInitialState:function() {
		return {relations:this.props.relations||{}};
	}
	,openRel:function(e) {
		this.props.rel[e.target.parentNode.dataset.n]=-this.props.rel[e.target.parentNode.dataset.n];
		e.stopPropagation();
		this.forceUpdate();
	}
	,renderRel:function(rel,opened,pcode,idx) {
		var children=null,extra=null;
		var rcaption=rel[0].caption;
		if (opened){
			extra=" ",
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 1px darkblue"};
			children=E(Relation,{depth:this.props.depth+1, rel:rel, relations:this.state.relations} );
		} else {
			relbtnstyle={cursor:"pointer",borderBottom:"dotted 2px blue"};

		}
		var expander=E("span",{onClick:this.openRel, style:relbtnstyle},rcaption);
		return E("span",{"data-pcode":pcode,"data-n":idx,draggable:true,key:"k"+idx,contentEditable:false,readOnly:true}
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
		this.props.rel[this.state.editing]=text;
		this.setState({editing:-1});
	}
	,renderItem:function(item,idx) {
		if (idx==0) return;
//dangerouslySetInnerHTML={{__html:item}}/>	
		if (typeof item=="string") {
			item=item.replace(/\n/g,"<br/>");
			if (this.state.editing==idx) {
				return <RelationTextEdit key={"k"+idx} text={item} onFinish={this.doneedit}/>
			} else {
				return <span onClick={this.edittext} key={"k"+idx} data-n={idx} style={textstyle} >{item}</span>	
			}
		} else if (typeof item==="number") {
			var opened=false;
			if (item<0) opened=true;
			var rel=this.state.relations[Math.abs(item)];
			var extra=null,children=null;
			var expander=null;
			if (rel) {
				if (Math.abs(item)%256==0 && this.props.depth<MAXVISIBLEDEPTH) {
					return this.renderRel(rel,opened,item,idx);
				} else {
					//final node, a span or a rel depth > MAXVISIBLEDEPTH

					return E("span",{"data-pcode":item,"data-n":idx,style:spanbtnstyle,
						key:"k"+idx,onClick:this.openpnode, draggable:true,contentEditable:false,readOnly:true},rel[0].caption);
				}
			} else {
				return E("span",{key:"k"+idx,"data-pcode":item, draggable:true,"data-n":idx,"style":spanbtnstyle,"contentEditable":false},Math.abs(item));
			}
		}
	}
	,render:function(){
		return <span style={styleFromDepth(this.props.depth)}>
		{this.props.rel.map(this.renderItem)}
		</span>
	}
	
});

module.exports=Relation;