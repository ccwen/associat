var React=require("react");
var kse=require("ksana-search");

var Container_perdb=require("./container_perdb.jsx");
var Container_rightPanel=require("./container_rightPanel.jsx");

var maincomponent = React.createClass({
  render: function() {
    return <div>
      <div className="col-md-9"><Container_perdb/></div>
      <div className="col-md-3"><Container_rightPanel/></div>
    </div>;
  }
});
module.exports=maincomponent;