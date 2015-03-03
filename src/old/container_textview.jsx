var React=require("react");
var dragobject=require("./drag");
var ScrollSyntag=require("./scrollsyntag");
var kde=require("ksana-database");
var Container_textview=React.createClass({
	propTypes:{
		db:React.PropTypes.string.isRequired
	}
	,getInitialState:function() {
		return {selected:0,db:this.props.db,tabid:["id1"],titles:["t1"],texts:["text1"]}
	}
	,componentDidMount:function() {
		kde.open(this.state.db,function(err,handle){
			this.setState({handle:handle});
		},this);
	}
	,renderTabContent:function(text,n){
		var id=this.props.db+"_"+this.state.tabid[n];
		var extra="fade";
		if (!this.state.handle) return;

		if (n==this.state.selected)  extra=" active";
		return <div className={"scrollsyntag tab-pane "+extra} key={"content"+id} id={id}>
			<ScrollSyntag db={this.state.handle} />
		</div>
	}
	,renderTabNav:function(tab,n){
		var id=this.props.db+"_"+this.state.tabid[n];
		var extra="";
		if (n==this.state.selected)  extra=" active";
		return <li role="presentation" key={"nav"+id} className={extra}><a role="tab" href={"#"+id}  data-toggle="tab">{tab}</a></li>
	}
	,dragstart:function(e) {
		if (dragobject.dragging) return;
		dragobject.from=e.target;
		var range = window.getSelection().getRangeAt(0);
		var start=range.startContainer.parentElement.dataset.vpos;
		var end=range.endContainer.parentElement.dataset.vpos;
		if (start && end && range) {
			dragobject.seg=1;
			dragobject.start= parseInt(start);
			dragobject.len=parseInt(end)-dragobject.start;
			dragobject.dragging=true;	
		}
	}
	,dragend:function(e) {
		dragobject.dragging=false;
	}
	,render:function(){
		return <div>
			<ul className="nav nav-tabs" role="tablist">
				{this.state.titles.map(this.renderTabNav)}
			</ul>
			<div onDragStart={this.dragstart} onDragEnd={this.dragend} 
			    className="tab-content" style={{overflow:"auto"}}>
				{this.state.texts.map(this.renderTabContent)}
			</div>
		</div>
	}
});
module.exports=Container_textview;