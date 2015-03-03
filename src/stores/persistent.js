var persistent=function() {
	var db = new PouchDB('associat');
	return {db:db};
}
module.exports=persistent();