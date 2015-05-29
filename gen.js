var pd=require("ksana-paradigm");
var kde=require("ksana-database");
var kse=require("ksana-search");
var moedict,openlit;
var pat=/\[引\]([^\n^。]+?)：「(.+?)」/g ;
var citations=[],ncitation=0;
var fs=require("fs");
var MAXLINK=10000;
kde.open("moedict",function(err,db){
	moedict=db;
	kse.search("openlit","子",function(error,res){
		openlit=res.engine;
		findLinks(function(out){
			citations=out;
			fs.writeFileSync("citations.json",JSON.stringify(citations,""," "),"utf8");
			console.log("start searching",citations.length,"links");
			searchlink();
		});
	})
});
var found=[];
var bingo=function(rawresult,excerpt,db) {
	var len=citations[ncitation];
	found.push([ncitation,rawresult,citations[ncitation],excerpt.text]);
}
var finalize=function() {
	fs.writeFileSync("found.json",JSON.stringify(found,""," "),"utf8");
	console.log("found",found.length);
}
var searchlink=function() {
	var tofind=citations[ncitation][5].substr(0,6);
	kse.search("openlit",tofind,{range:{start:0},nohighlight:true},function(err,res){
		var percent=(citations.length/100);
		var now=Math.floor(ncitation/percent)+1;
		if (now>last) console.log(now+"%");
		last=now;

		if (res && res.rawresult && res.rawresult.length==1) {
			bingo(res.rawresult[0],res.excerpt[0],res.engine);	
		}

		ncitation++;
		if (ncitation>=citations.length) {
			finalize();
			return;
		}
		process.nextTick(searchlink);
	});
}
var last=0;
var findLinks=function(cb) {
	var out=[];
	moedict.get(["filecontents"],{recursive:true},function(data){
		for (var i=0;i<data.length;i++) {
			for (var j=0;j<data[i].length;j++) {
				var percent=(data[i].length/10);
				var now=Math.floor(j/percent)+1;
				if (now>last) console.log(now*10+"%");
				last=now;

				var vpos=moedict.fileSegToVpos(i,j);
				if (!data[i][j]) continue;
				var ci=pd.citation.extract(data[i][j],{startvpos:vpos,tokenize:openlit.analyzer.tokenize,pat:pat});
				out=out.concat(ci);
				if (MAXLINK && out.length>MAXLINK) break;
			}
		}
		cb(out);
	})
}