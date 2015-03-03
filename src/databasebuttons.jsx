/*
	create a set of buttons , order described by ksana.js dataviews
*/
var React=require("react");
var kde=require("ksana-database");
var actions=require("./action_dataview");
var DatabaseButtons=React.createClass({
	getInitialState:function() {
		return {databases:[]}
	}
	,sortDataview:function(databases){
		var out=[];
		databases=databases.map(function(db){
			if (db.indexOf(".kdb")>-1) db=db.substring(0,db.length-4);	
			return db;
		});

		for (var i in ksana.js.databases) {
			var caption=ksana.js.databases[i].caption;
			if (databases.indexOf(i)>-1) {
				out.push([i,caption]);
			}
		}
		return out;
	}
	,componentDidMount:function() {
		kde.enumKdb(function(databases){
			this.setState({databases:this.sortDataview(databases)});
		},this);
	}
	,opendb:function(e) {
		var insertAt;
		if (e.ctrlKey) insertAt=0;
		actions.open(e.target.name, 0, insertAt );
	}
	,renderItem:function(item,idx) {
		return <button className="btn btn-primary" 
			key={idx} name={item[0]}>{item[1]}</button>
	}
	,render:function(){
		return <div onClick={this.opendb}>
			{this.state.databases.map(this.renderItem)}
		</div>
	}
});
module.exports=DatabaseButtons;