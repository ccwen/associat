var React = require("react");
var Reflux = require("reflux");
var store_toc = require("./stores/toc");

var TocTrees = React.createClass({
  mixins:[Reflux.listenTo(store_toc,"onStoreToc")]
  ,onStoreToc:function(tocs) {
    console.log(tocs)
  }
  ,render: function() {
    return (
      <div />
    );
  }

});

module.exports = TocTrees;
