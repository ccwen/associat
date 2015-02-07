var Container_textview=React.createClass({
	propTypes:{
		db:React.PropTypes.string.isRequired
	}
	,getInitialState:function() {
		return {selected:0,db:this.props.db,tabid:["id1","id2"],titles:["t1","t2"],texts:["text1","text2"]}
	}
	,renderTabContent:function(text,n){
		var id=this.props.db+"_"+this.state.tabid[n];
		var extra="fade";
		if (n==this.state.selected)  extra=" active";
		return <div className={"tab-pane "+extra} key={"content"+id} id={id}>{text}</div>
	}
	,renderTabNav:function(tab,n){
		var id=this.props.db+"_"+this.state.tabid[n];
		var extra="";
		if (n==this.state.selected)  extra=" active";
		return <li role="presentation" key={"nav"+id} className={extra}><a role="tab" href={"#"+id}  data-toggle="tab">{tab}</a></li>
	}
	,render:function(){
		return <div>
			<ul className="nav nav-tabs" role="tablist">
				{this.state.titles.map(this.renderTabNav)}
			</ul>
			<div className="tab-content" style={{overflow:"auto"}}>
				{this.state.texts.map(this.renderTabContent)}
			</div>
		</div>
	}
});
module.exports=Container_textview;