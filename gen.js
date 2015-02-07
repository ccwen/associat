var pd=require("ksana-paradigm");
var kde=require("ksana-database");
var kse=require("ksana-search");
var moedict,openlit;
var pat=/\[引\]([^\n^。]+?)：「(.+?)」/g ;

kde.open("moedict",function(err,db){
	moedict=db;
	kse.search("openlit","子",function(error,res){
		openlit=res.engine;
		findLinks();
	})
});

var findLinks=function() {
	moedict.get(["filecontents"],{recursive:true},function(data){
		for (var i=0;i<data.length;i++) {
			for (var j=0;j<data[i].length;j++) {
				var vpos=moedict.fileSegToVpos(i,j);
				if (!data[i][j]) continue;
				var ci=pd.citation.extract(data[i][j],{startvpos:vpos,tokenize:openlit.analyzer.tokenize,pat:pat});
				console.log(ci)
			}
		}
	})
}