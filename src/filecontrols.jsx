var React = require('react');
var persistent=require("./persistent");

var FileControls = React.createClass({
  save:function() {
    persistent.writeFile("src/test.txt",'中文Hello World'+Math.random(),function(err){
      if (!err) {
        console.log("written");
      } else {
        console.log("write error")
      }
    });
  }
  ,load:function() {
    persistent.readFile("src/test.txt",function(err,data){
      console.log(data);
    });
  }
  ,render: function() {
    return (
      <div><button onClick={this.save}>save</button>
      <button onClick={this.load}>load</button>
      </div>
    );
  }

});

module.exports = FileControls;
