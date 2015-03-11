var endAt=function(relations,vpos) {
  return relations.filter(function(item){
    return (item[1]===vpos)
  });
}
var startAt=function(relations,vpos) {
  return relations.filter(function(item){
    return (item[0]===vpos)
  });
}

var relation_utils={startAt:startAt,endAt:endAt};
module.exports=relation_utils;
