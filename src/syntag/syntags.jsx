var React=require("react");
var Reflux=require("reflux");
var store_database=require("../stores/dataview");
var SyntagEdit=require("./syntagedit.jsx");
var ExcerptView=require("./excerptview.jsx");
var minHeight=200;
var E=React.createElement;

var Syntags=React.createClass({
	mixins:[Reflux.listenTo(store_database,"onStoreDatabase")]
	,getInitialState:function() {
		return {databases:[]};
	}
	,onStoreDatabase:function(databases) {
		var parentH=this.getDOMNode().offsetHeight;
		var h=(parentH/databases.length) - 20;
		if (h<minHeight) h=minHeight;
		this.suggestedHeight=h;
		this.setState({databases:databases});
	}
	,renderItem:function(item,idx) {
		var setting=ksana.js.databases[item[1].dbname];
		var dbkey=item[0];
		var db=item[1];
		var opts=item[2]||{};
		var comp=SyntagEdit;
		if (opts.query) comp=ExcerptView;
		return E("div",{key:dbkey},
				E(comp,{db:db,opts:opts,setting:setting,
						dbkey:dbkey,height:this.suggestedHeight})
		);
	}
	,render:function(){
		return <div style={{height:"100%"}}>
			{this.state.databases.map(this.renderItem)}
		</div>
	}
});
module.exports=Syntags;