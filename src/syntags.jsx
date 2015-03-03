var React=require("react");
var Reflux=require("reflux");
var store_database=require("./store_database");
var SyntagEdit=require("./syntagedit.jsx");
//var ExcerptList=require("./excerptlist.jsx");
var minHeight=200;
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

		return <div key={item[0]}>
			<SyntagEdit height={this.suggestedHeight} db={item[1]} setting={setting} id={item[0]}/>
		</div>
	}
	,render:function(){
		return <div style={{height:"100%"}}>
			{this.state.databases.map(this.renderItem)}
		</div>
	}
});
module.exports=Syntags;