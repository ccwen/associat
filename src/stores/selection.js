/*
  maintain a list of and selected pnode and span

  provide function to retrieve selected pcode

  
*/

var Reflux=require("reflux");
var actions=require("../actions/selection");

var store_selection=Reflux.createStore({
	listenables: [actions]
	,selections:{}
	,init:function() {
	}
	,removeOverlapSelection:function(selections,start,len) {
		return selections.filter(function(sel){
			return (sel[0]>start+len || sel[0]+sel[1]<start);
		});
	}
	,hasSameSelection:function(selections,start,len) {
		for (var i=0;i<selections.length;i++) {
			var sel=selections[i];
			if (sel[0]==start &&sel[1]==len) return i;
		}
		return -1;
	}
	,onClearSelection:function(wid) {
		this.onSetSelection({},wid);
	}
	,onClearSelections:function() {
		var keys=Object.keys(this.selections);
		var cleared={};
		for (var i=0;i<keys.length;i++) {
			cleared[keys[i]]=[];
		}
		this.onSetSelections(cleared);
	}
	,onAddSelection:function(wid,existingselections,start,len,append) {
		var selections=JSON.parse(JSON.stringify(existingselections));
		var oldselections=selections;
		var same=this.hasSameSelection(selections,start,len);
		var updated=true;

		if (same>-1) { //toggle 
			selections.splice(same,1);
		} else {
			oldlength=selections.length;
			selections=this.removeOverlapSelection(selections,start,len);
			if (append && len) {
				selections.push([start,len]);
			} else {
				if (len) {
					selections=[[start,len]];
				} else {
					if (selections.length) selections=[];
					else updated=false;
				}
			}
		}

		if (updated) {
			actions.setSelection(selections , wid);
		}
	}
	,onSetSelection:function(selections,wid) {
		this.selections[wid]=selections;
		actions.clearHighlights();
		this.trigger(this.selections,wid);

		//remove empty selection after updating views
		if (selections.length==0) {
			delete this.selections[wid];
		}		
	}
	,onSetSelections:function(selections) {
		for (var i in selections) {
			this.selections[i]=selections[i];
		}
		var updated=Object.keys(selections);
		for (var i=0;i<updated.length;i++){
			this.trigger(this.selections,updated[i]); //notify affected view
		}
		actions.clearHighlights();
	}
	,getSelections:function(){
		return this.selections;
	}
	,getSelection:function(wid){
		return this.selections[wid];
	}
});

module.exports=store_selection;