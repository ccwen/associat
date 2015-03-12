var React=require("react");
var Reflux=require("reflux");

var kse=require("ksana-search");
var ScrollPagination = require("../scrollpagination").ScrollPagination;
var Page = require("../scrollpagination").ScrollPaginationPage;
var store_selection=require("../stores/selection");
var store_paradigm=require("../stores/paradigm");
var SyntagEvents=require("./syntag_events.jsx");
var relation_utils=require("../relation_utils");
var Relation=require("../pnode/embedded_relation.jsx");
var E=React.createElement;


var ScrollSyntag=React.createClass({
	mixins:[Reflux.listenTo(store_paradigm,"onStoreParadigm"),
	Reflux.listenTo(store_selection,"onStoreSelection")]
	,propTypes:{
		wid:React.PropTypes.string.isRequired
		,db:React.PropTypes.object.isRequired
		,opts:React.PropTypes.object.isRequired
		,onFirstVisiblePageChanged:React.PropTypes.func
		,onVisiblePageChanged:React.PropTypes.func
	}
	,getInitialState:function() {
		var pages=[];
		var segcount=this.props.db.get("meta").segcount;
		for (var i = 0; i < segcount-1; i++) {
			pages.push({
				id: i+1,
				data:null
				//items: pageItems("page-"+ (i+1))
			});
		}
		this.loadedPages=[];
		return {pages:pages,selections:[],highlights:[],paradigm:[]};
	}
	,loadedPages:[]
	,onStoreParadigm:function(dbname,data) {
		if (dbname!==this.props.db.dbname) return;
		this.setState({paradigm:data});
	}
	,getFirstVisiblePage:function() {
		var first=this.refs.scrollPagination.firstVisiblePage();
		var pg=this.loadedPages[first];
		if (pg && this.pageid!==pg.id) {
			this.props.onFirstVisiblePageChanged(this.props.wid,pg.id);
			this.pageid=pg.id;
		}
	}
	,componentWillUnmount:function() {
		clearInterval(this.fvptimer);
	}
	,scrollto:function(opts) {
		if (opts.scrollto) {
			var scrollto=parseInt(opts.scrollto);
			this.vpos=Math.floor(scrollto / 256);
			var len=scrollto%256;
			this.setState({highlights:[ [this.vpos,len ] ] });
		}
	}
	,componentWillReceiveProps:function(nextProps) {
		this.scrollto(nextProps.opts);
	}
	,componentDidUpdate:function() {
		if (this.updatedtimer) clearTimeout(this.updatedtimer);
		setTimeout(function(){
			if (this.vpos) {
				this.goToVpos(this.vpos);
				this.vpos=0;
			}
		}.bind(this),100);

		var that=this;
		if (this.props.onVisiblePageChanged) {
				this.updatedtimer=setTimeout(function(){
					that.props.onVisiblePageChanged(that.props.wid,that.loadedPages[0].id,
					that.loadedPages[that.loadedPages.length-1].id);
					that.vpos=0;
			},300);
		}

		if (this.fvptimer) {
			clearInterval(this.fvptimer);
			this.fvptimer=setInterval(function(){
				that.getFirstVisiblePage();
			},3000);
		}

	}
	,componentDidMount:function(){
		this.scrollto(this.props.opts);
	  if (this.vpos) {
			this.goToVpos(this.vpos);
			this.vpos=0;
		} else	if (this.props.opts.pageid) {
			this.goToPage(this.props.opts.pageid);
		} else {
			this.loadNextPage();
		}
		var that=this;
		if (this.props.onFirstVisiblePageChanged) this.fvptimer=setInterval(function(){
			that.getFirstVisiblePage();
		},3000);
	}
	,__handlePageEvent: function (pageId, event) {
		//console.log(this.loadedPages)
		this.refs.scrollPagination.handlePageEvent(pageId, event);
	}
	,getPageText:function(pageId,cb,context) {
		kse.highlightSeg(this.props.db,0,pageId,{token:true},function(data){
			cb.call(context,data.text,data.segname);
		},this);
	}
	,hasNextPage : function () {
		var pages=this.state.pages;
		return  (this.loadedPages[this.loadedPages.length-1] !== pages[pages.length-1]) ;
	}
	,hasPrevPage : function () {
		var pages=this.state.pages;
		return (this.loadedPages[0] !== pages[0]);
	}
	,goToPage:function(nseg) {
		var pages=this.state.pages;
		this.loadedPages=[];
		this.loadPage(pages[nseg]);
	}
	,goToVpos:function(vpos) {
		var pages=this.state.pages;
		this.loadedPages=[];
		var nseg=this.props.db.absSegFromVpos(vpos);
		if (nseg>2) nseg-=1;
		this.loadPage(pages[nseg]);
	}
	,loadPage:function(page,prev) {
		if (prev) {
			this.loadedPages.unshift(page);
		} else {
			this.loadedPages.push(page);
		}

		this.getPageText(page.id,function(data,segname){
				page.data=data;
				page.segname=segname;
				if (prev) {
					this.setState({hasPrevPage: this.hasPrevPage()});
				} else {
					this.setState({hasNextPage: this.hasNextPage()});
				}
		},this);
	}
	,loadNextPage : function () {
		var pages=this.state.pages;
		var lastLoadedPage = this.loadedPages[this.loadedPages.length-1];
		var index = pages.indexOf(lastLoadedPage);
		var page = pages[index+1];
		if (!page) return false;
		this.loadPage(page);
		return true;//set loadingNextPage flag
	}
	,onStoreSyntag:function(db,seg) {
		if (db!=this.props.db.dbname) return;
		this.goToPage(seg);
	}
	,onStoreSelection:function(selections,wid) {
		var sels=selections[wid];
		if (wid!=this.props.wid || //not my business
		  JSON.stringify(sels)==JSON.stringify(this.state.selections)) return ; //nothing to update
		this.setState({selections:sels});
	}
	,loadPrevPage : function () {
		var pages=this.state.pages;
		var firstLoadedPage = this.loadedPages[0];
		var index = pages.indexOf(firstLoadedPage);
		var page = pages[index-1];
		if (!page) return false;
		this.loadPage(page,true);
		return true;//set loadingPrevPage flag
	}
	,unloadPage : function (pageId) {
		var page = null;
		var index = null;
		for (var i = 0, len = this.loadedPages.length; i < len; i++) {
			if (this.loadedPages[i].id === pageId) {
				page = this.loadedPages[i];
				index = i;
				break;
			}
		}

		if (page === null) {
			throw new Error("Invalid attempt to unload page: "+ pageId +"\n"+ JSON.stringify(this.loadedPages.map(function (p) { return p.id; })));
		}

		this.loadedPages = this.loadedPages.slice(0, index).concat(this.loadedPages.slice(index+1, this.loadedPages.length));
		this.setState({	hasNextPage: this.hasNextPage(),	hasPrevPage: this.hasPrevPage()});
	}
	,inSelected:function(vpos) {
		for (var i=0;i<this.state.selections.length;i++) {
			var sel=this.state.selections[i];
			if (vpos>=sel[0] && vpos<sel[0]+sel[1]) return true;
		}
		return false;
	}
	,highlighedStyle:function(idx) {
		for (var i=0;i<this.state.highlights.length;i++) {
			var hl=this.state.highlights[i];
			if (idx>=hl[0] && idx<hl[0]+hl[1]) {
				if (this.editing && this.editing[0]==hl[0] && this.editing[1]==hl[1]) {
					return "editing";
				} else {
					return "highlighted";
				}
			}
		}
		return "";
	}
	,renderMarkups:function(vpos){
		var ends=relation_utils.endAt(this.state.paradigm,vpos);
		var children=null;
		if (ends.length) {
			children=ends.map(function(markup,idx){
				var self=markup[0]*256+(markup[1]-markup[0]+1);
				return E(Relation,{key:"i"+idx,self:self,depth:0,dbid:this.props.db.dbname,pnode:[{},markup[2]]});
			},this);
		}
		if (!children) return null;
		return <span>{children}</span>;
	}
	,renderChar:function(item,idx){
		var vpos=item[1];
		var text=item[0];
		var cls="";
		if (this.inSelected(vpos)) cls="selected";
		cls+=this.highlighedStyle(vpos);
		var children=this.renderMarkups(vpos);

		if (text=="\n") return <br key={'i'+idx} /> ;
		return E("span",{className:cls,key:"i"+idx,"data-vpos":vpos},text,children);
	}
	,render: function () {

		return E(ScrollPagination, {
			ref: "scrollPagination",
			loadNextPage: this.loadNextPage,
			loadPrevPage: this.loadPrevPage,
			unloadPage: this.unloadPage,
			hasNextPage: this.hasNextPage,
			hasPrevPage: this.hasPrevPage,
			component:SyntagEvents,
			selections:this.state.selections,
			wid:this.props.wid,
			showCaret:true,
		}, this.loadedPages.map(function (page, index) {
			var spans=page.data.map(this.renderChar);

			spans.unshift(<span key="pageid">{page.id}</span>);
			return E(Page, { key: page.id, id:page.id,
				onPageEvent: this.__handlePageEvent},spans	)
		}.bind(this)));
	}
});

module.exports=ScrollSyntag;
