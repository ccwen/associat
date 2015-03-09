var React = require("react");
var Reflux=require("reflux");

var action_paradigm=require("./actions/paradigm");
var store_selection=require("./stores/selection");

var RightControls = React.createClass({
  mixins:[Reflux.listenTo(store_selection,"onStoreSelection")]
  ,onStoreSelection:function(selections) {
    this.selections=selections;
  }
  ,newrelation:function(e) {
    action_paradigm.newParadigm(this.selections);
  }
  ,render: function() {
    return (
      <div><a onClick={this.newrelation}
        className="btn btn-default btn-small">new paradigm</a></div>
    );
  }

});

module.exports = RightControls;
