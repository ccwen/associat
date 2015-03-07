var React = require('react');
var action_pnode=require("./actions/pnode");
var RightControls = React.createClass({
  newrelation:function(e) {
    action_pnode.createPNode();
  }
  ,render: function() {
    return (
      <div><a onClick={this.newrelation}
        className="btn btn-default btn-small">new relation</a></div>
    );
  }

});

module.exports = RightControls;
