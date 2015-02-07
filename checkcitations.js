var citations=require("./citations");
for (var i=0;i<citations.length;i++) {
	var cit=citations[i];
	if (cit[4]>255) {
		console.log(cit)
	}
}