var React=require("react");
var Reflux=require("reflux");
var store_database=require("./store_database");
var SyntagEdit=require("./syntagedit.jsx");

var C_syntagedit=React.createClass({
	mixins:[Reflux.listenTo(store_database,"onStoreDatabase")]
	,getInitialState:function() {
		return {databases:[]};
	}
	,onStoreDatabase:function(databases) {
		this.setState({databases:databases});
	}
	,renderItem:function(item,idx) {
		var setting=ksana.js.databases[item.dbname];
		return <SyntagEdit db={item} setting={setting}/>
	}
	,render:function(){
		return <div>
			{this.state.databases.map(this.renderItem)}
		</div>
	}
});
module.exports=C_syntagedit;