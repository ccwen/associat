var Reflux=require("reflux");
var React=require("react");
var action_pnode=require("../actions/pnode");
var action_paradigm=require("../actions/paradigm");
var action_selection=require("../actions/selection");
var store_selection=require("../stores/selection");

var Relation=require("./embedded_relation.jsx");
//var testdata=require("./propedit_testdata");
//var editing_rel=testdata.forward[1];
//number , a span
//object , a rel
//string , normal text
var E=React.createElement;
var store_paradigm=require("../stores/paradigm");
var RelationDropdown=require("./relation_dropdown.jsx");
//var editing_rel=[{caption:"editing r"}, 512, "b",512, "c", 516 ,"d", 145153,"x"];
//var relbtnstyle={cursor:"pointer",borderBottomStyle:"double",color:"blue"};


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
		return {caretPos:0, pnode:JSON.parse(JSON.stringify(this.props.pnode)),
			wid:this.props.dbid+"_*"+this.props.pcode};
	}
	,mixins:[Reflux.listenTo(store_selection,"onStoreSelection")]
	,onStoreSelection:function(selections,wid) {
		if (wid!==this.state.wid)return;
		if (Object.keys(selections[wid]).length==0) {
			this.refs.heading.getDOMNode().classList.remove("selected");
		}
	}
	,propTypes:{
		dbid:React.PropTypes.string.isRequired
		,pcode:React.PropTypes.number.isRequired
		,pnode:React.PropTypes.array.isRequired
		,usedby:React.PropTypes.array.isRequired
	}
	,keydown:function(e) {
		e.preventDefault();
	}
	,componentWillMount:function() {
		this.pd=store_paradigm.load(this.props.dbid);
	}
	,componentDidMount:function() {
		action_paradigm.getRelations();
		this.refs.caption.getDOMNode().contentEditable=true;
	}
	,close:function() {
		action_pnode.close(this.props.pcode,this.props.dbid);
	}
	,save:function() {
		//this is not good
		this.props.pnode[0].caption=this.state.pnode[0].caption;
		action_paradigm.update();
	}
	,captionkeydown:function(e) {
		if (e.key=="Enter") {
			var pnode=this.state.pnode;
			pnode[0].caption=e.target.innerText.substring(0,10);
			e.preventDefault();
			this.setState({pnode:pnode});
			this.save();
		}
	}
	,toggleSelect:function(e) {
		if (!e.target.classList.contains("panel-heading"))return;
		e.target.classList.toggle("selected");
		var caption=this.state.pnode[0].caption;
		action_selection.toggleSelection(this.state.wid,this.props.pcode,0, caption);
	}
	,usedby:function() {
		if (this.props.usedby.length) {
			return <span className="pull-right"><RelationDropdown pd={this.pd} items={this.props.usedby}/></span>
		}
	}
	,render:function(){
		//var relationstatic=React.renderToStaticMarkup();
		return <div className="panel panel-default">
			<div ref="heading" className="panel-heading" onClick={this.toggleSelect}>
				<span className="panel-title" >
				    <span ref="caption" spellCheck={false} onKeyDown={this.captionkeydown}>{this.state.pnode[0].caption}</span>
					<a href="#" onClick={this.close} className="pull-right btn btn-xs btn-link closebutton">{"\u2613"}</a>
				    {this.usedby()}
				</span>
			</div>
			<div ref="body" onKeyDown={this.keydown} onKeyUp={this.keyup} onInput={this.oninput} onBlur={this.onblur}
			 onPaste={this.onpaste} onCut={this.oncut} spellCheck={false}
			 className="panel-body" style={{display:"inline-block",lineHeight:"165%"}}>
			 <Relation dbid={this.props.dbid} pnode={this.props.pnode} depth={0} caretPos={this.state.caretPos}/>
			 </div>
		</div>
	}
	//dangerouslySetInnerHTML={{__html:relationstatic}}/>
});
module.exports=PNodeEdit;
