var dragndrop_mixin={
	ondrop:function(e) {
		console.log("drop");
		e.preventDefault();
	}
}
module.exports=dragndrop_mixin;