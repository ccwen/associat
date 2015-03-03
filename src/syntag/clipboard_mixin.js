var clipboard_mixin={
	oncopy:function(e) {
		console.log("copy");
	}
	,onpaste:function(e) {
		console.log("paste");
		e.preventDefault();
	}
	,oncut:function(e) {
		console.log("cut");
		e.preventDefault();
	}

};

module.exports=clipboard_mixin;