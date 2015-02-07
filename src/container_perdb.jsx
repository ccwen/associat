
var Perdb=require("./perdb.jsx");
var Container_perdb=React.createClass({
	getInitialState:function() {
		return {dbcollection:["moedict","openlit"]};
	}
	,renderPerdb:function(db){
		return <Perdb key={db} db={db}/>
	}
	,render:function(){
		return <div>
			{this.state.dbcollection.map(this.renderPerdb)}
		</div>
	}
});
module.exports=Container_perdb;