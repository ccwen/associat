var React = require("react");
var Reflux=require("reflux");

var action_paradigm=require("./actions/paradigm");
var store_selection=require("./stores/selection");
var testselections={"ds_823":[[2963,3,"切眾生"]],"dsl_jwn_241":[[8708,4,"若明得經"]]};

var RightControls = React.createClass({
  mixins:[Reflux.listenTo(store_selection,"onStoreSelection")]
  ,onStoreSelection:function(selections) {
    this.selections=selections;
  }
  ,newrelation:function(e) {
    var sel=this.selections||testselections;
    action_paradigm.newParadigm(sel);
  }
  ,render: function() {
    return (
      <div><a onClick={this.newrelation}
        className="btn btn-default btn-small">new paradigm</a></div>
    );
  }

});

module.exports = RightControls;
