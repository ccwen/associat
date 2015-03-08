var endAt=function(relations,vpos) {
  var end=vpos*256;
  return relations.filter(function(item){
    return (item[1]===end)
  });
}
var startAt=function(relations,vpos) {
  var start=vpos*256;
  return relations.filter(function(item){
    return (item[0]===start)
  });
}

var relation_utils={startAt:startAt,endAt:endAt};
module.exports=relation_utils;
