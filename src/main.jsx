var kse=require("ksana-search");
var velocity=require("velocity-animate/velocity.min.js");
require("velocity-animate/velocity.ui.min.js");

var Container_perdb=require("./container_perdb.jsx");
var Container_propedit=require("./container_propedit.jsx");

var maincomponent = React.createClass({
  render: function() {
    return <div>
      <div className="col-md-9"><Container_perdb/></div>
      <div className="col-md-3"><Container_propedit/></div>
    </div>;
  }
});
module.exports=maincomponent;