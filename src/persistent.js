/* read and write utf8 text file to chrome filesytem or local file system */

var writeFile=function(filename,content,cb) {
	if (ksana.platform==="chrome") {
	    var blob = new Blob([content], {type: 'text/plain;charset=UTF-8'});
	    ksana.runtime.html5fs.writeFile(filename,blob,cb);
	} else if (ksana.platform==="node-webkit"){
		require("fs").writeFile(filename,content,"utf8",cb);
	}
}

var readFile=function(filename,cb) {
	if (ksana.platform==="chrome") {
	    ksana.runtime.html5fs.readFile(filename,function(data){
	    	cb(0,data);
	    });
	} else if (ksana.platform==="node-webkit"){
		require("fs").readFile(filename,"utf8",cb);
	}	
}

module.exports={writeFile:writeFile,readFile:readFile};