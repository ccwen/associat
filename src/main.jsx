var React=require("react");
var LeftTabs=require("./lefttabs.jsx");
var MiddlePanel=require("./middlepanel.jsx");
var RightPanel=require("./rightpanel.jsx");
var maincomponent = React.createClass({
  render: function() {
    return <div>
      <div className="col-md-3"><LeftTabs/></div>
      <div className="col-md-6"><MiddlePanel/></div>
      <div className="col-md-3"><RightPanel/></div>
    </div>;
  }
});
module.exports=maincomponent;