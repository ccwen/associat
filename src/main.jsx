var React=require("react");
var LeftTabs=require("./lefttabs.jsx");
var MiddlePanel=require("./middlepanel.jsx");
var RightPanel=require("./rightpanel.jsx");
var Columns=require("./columns.jsx");
var maincomponent = React.createClass({
  render: function() {
    return <Columns sizes={[3,6,3]}>
      <LeftTabs/>
      <MiddlePanel/>
      <RightPanel/>
    </Columns>;
  }
});

module.exports=maincomponent;
