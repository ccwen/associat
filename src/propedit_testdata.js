var barrel=require("ksana-paradigm").barrel;

var create=function() {
	pd=barrel.open("db1");
	var pcode1=barrel.pcodeFromSpan(5,2);
	var pcode2=barrel.pcodeFromSpan(10,3);
	var pcode3=barrel.pcodeFromSpan(15,3);
	var payload={"tag":"synonym"};
	var payload2={"tag":"higherlevel"};
	var pcode=pd.addRel(payload,pcode1,pcode2);
	pd.addRel(payload2,pcode1,pcode3);
	return pd;
}

var data=create();
module.exports=data;