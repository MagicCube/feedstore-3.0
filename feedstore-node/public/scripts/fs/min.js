/* Sat Jun 21 09:33:35 CST 2014 */
/* Generated by MagicCube MXBuild with MXFramework */
$ns("fs");$import("lib.transit.transit");$import("fs.biz.PostAgent");$import("fs.biz.SubscriptionAgent");$import("fs.util.DateTimeUtil");$import("fs.view.CateogryListView");$import("fs.view.PostListView");$import("fs.view.PostDetailView");
fs.App=function(){function c(c){a.showOverlay();a.postDetailView.$container.css({opacity:0,position:"fixed",zIndex:9999,top:c.$post.offset().top-document.body.scrollTop,left:c.$post.offset().left,width:c.$post.width(),height:c.$post.height()});a.postDetailView.setPost(c.post);a.$container.append(a.postDetailView.$container);c=0.8*window.innerWidth;1280<c&&(c=1280);a.postDetailView.$container.transit({opacity:1,left:(window.innerWidth-c)/2,top:80,width:c,height:window.innerHeight-80})}var a=$extend(mx.app.Application);
a.appId="fs.App";a.appDisplayName="MagicCube FeedStore";var e={};a.subscriptionAgent=null;a.postAgent=null;a.categoryListView=null;a.postListView=null;var d=a.postDetailView=null;e.init=a.init;a.init=function(d){e.init(d);a.subscriptionAgent=new fs.biz.SubscriptionAgent;a.postAgent=new fs.biz.PostAgent;a.categoryListView=new fs.view.CateogryListView({id:"categoryList",frame:{right:12}});a.addSubview(a.categoryListView,a.$container.find("#header"));a.postListView=new fs.view.PostListView({id:"postList",
frame:{left:0,top:0,right:0,bottom:0},onpostclick:c});a.postListView.css({paddingTop:62});a.addSubview(a.postListView);a.postDetailView=new fs.view.PostDetailView({id:"postDetail"})};e.run=a.run;a.run=function(c){a.subscriptionAgent.load().done(function(){a.postListView.load()})};a.getServiceUrl=function(a){return $mappath("~/api"+a)};a.showOverlay=function(){null===d&&(d=$("\x3cdiv id\x3doverlay\x3e"),d.on("click",a.hideOverlay));d.css("opacity",0);$(document.body).css({overflow:"hidden"}).append(d);
d.transit({opacity:1},"fast")};a.hideOverlay=function(){$(document.body).css({overflow:"auto"});a.postDetailView.$container.fadeOut();d.transit({opacity:0},"fast",function(){d.detach()})};return a.endOfClass(arguments)};fs.App.className="fs.App";$ns("fs.biz");fs.biz.PostAgent=function(){var c=$extend(MXComponent),a={};a.init=c.init;c.init=function(c){a.init(c)};c.queryPosts=function(a){a=$.extend({pageIndex:0,pageSize:50},a);return $.ajax({url:fs.app.getServiceUrl("/posts/"),data:a})};return c.endOfClass(arguments)};fs.biz.PostAgent.className="fs.biz.PostAgent";$ns("fs.biz");fs.biz.SubscriptionAgent=function(){var c=$extend(MXComponent),a={};c.channels=[];a.init=c.init;c.init=function(c){a.init(c)};c.addChannel=function(a){c.channels.add(a);c.channels[a._id]=a;c.channels[a.cid]=a};c.load=function(){var a=$.Deferred();$.ajax({url:fs.app.getServiceUrl("/subscriptions/")}).done(function(d){d.forEach(function(a){c.addChannel(a)});a.resolve()});return a};return c.endOfClass(arguments)};fs.biz.SubscriptionAgent.className="fs.biz.SubscriptionAgent";$ns("fs.util");fs.util.DateTimeUtilClass=function(){var c=$extend(MXObject);c.parseServerTime=function(a){return new Date(a)};c.getShortString=function(a){var c=Date.now();return a>c-6E4?"\u521a\u521a":a>c-36E5?Math.round((c-a)/1E3/60)+" \u5206\u949f\u524d":a>c-864E5?Math.round((c-a)/1E3/60/60)+" \u5c0f\u65f6\u524d":a>c-1728E5?"\u6628\u5929":a>c-2592E5?"\u524d\u5929":$format(a,"M\u6708d\u65e5")};return c.endOfClass(arguments)};fs.util.DateTimeUtil=new fs.util.DateTimeUtilClass;
fs.util.DateTimeUtilClass.className="fs.util.DateTimeUtilClass";$ns("fs.view");$include("fs.res.CateogryListView.css");fs.view.CateogryListView=function(){var c=$extend(mx.view.View);c.elementClass="CateogryListView";var a={};a.init=c.init;c.init=function(e){a.init(e);c.$container.append("\x3cul\x3e\x3cli\x3e\u5168\u90e8\x3c/li\x3e\x3cli\x3e\u79d1\u6280\x3c/li\x3e\x3cli\x3e\u8bbe\u8ba1\x3c/li\x3e\x3cli\x3e\u5f00\u53d1\x3c/li\x3e\x3cli\x3e\u8d2d\u7269\x3c/li\x3e\x3c/ul\x3e")};return c.endOfClass(arguments)};fs.view.CateogryListView.className="fs.view.CateogryListView";$ns("fs.view");$include("fs.res.PostDetailView.css");
fs.view.PostDetailView=function(){var c=$extend(mx.view.View);c.elementClass="PostDetailView";var a={},e=c.post=null,d=null,l=null,m=null;a.init=c.init;c.init=function(b){a.init(b);b=$("\x3cdiv id\x3dpost\x3e");var h=$("\x3cdiv id\x3dheader\x3e");e=$("\x3ch1\x3e");h.append(e);h.append("\x3chr\x3e");l=$("\x3cdiv id\x3dpublishTime\x3e");h.append(l);m=$("\x3cdiv id\x3dchannel\x3e");h.append(m);b.append(h);d=$("\x3cdiv id\x3dcontent\x3e");b.append(d);c.$container.append(b)};c.setPost=function(a){c.post=
a;e.text(a.title);d.html(a.content);m.text(fs.app.subscriptionAgent.channels[a.cid].title);l.text($format(a.publishTime,"M\u6708d\u65e5 HH:mm"))};return c.endOfClass(arguments)};fs.view.PostDetailView.className="fs.view.PostDetailView";$ns("fs.view");$include("fs.res.PostListView.css");
fs.view.PostListView=function(){function c(){b.loading||(b.loading=isEmpty(void 0)?!0:!1,fs.app.postAgent.queryPosts({pageIndex:b.pageIndex,pageSize:b.pageSize}).done(function(a){b.loading=isEmpty(!1)?!0:!1;b.addPosts(a);b.pageIndex++}))}function a(){if(!(null===k||0===k.length)){var a=b.$container[0].scrollTop+document.body.offsetHeight,d=k.reduce(function(a,b){return isEmpty(a)||a>b.height()?b.height():a},Number.MAX_VALUE);a>d+20&&c()}}function e(c){b.frame.height=b.$container.height();b.frame.width!==
b.$container.width()&&(b.frame.width=b.$container.width(),b.resetCols(),a())}function d(b){a()}function l(a){a=$(a.currentTarget).parent();var c=a.data("post");b.trigger("postclick",{post:c,$post:a})}function m(a){a.target.src=b.getResourcePath("images.post-thumb-placeholder","png")}var b=$extend(mx.view.View);b.elementClass="PostListView";b.frame={};var h={};b.posts=[];b.cols=0;b.colIndex=0;b.pageIndex=0;b.pageSize=50;b.colSpace=12;b.onpostclick=null;var k=[],f=null;h.init=b.init;b.init=function(a){h.init(a);
b.$container.on("click",".post \x3e #thumb, .post \x3e #title",l);b.$container.on("scroll",d);$(window).on("resize",e)};b.load=function(){e();b.clear();c()};b.resetCols=function(){var a=Math.floor(b.frame.width/(224+b.colSpace));6<a&&(a=6);if(b.cols!==a){null===f&&(f=$("\x3cdiv class\x3dcolgroup\x3e"),b.$container.append(f));k.clear();b.cols=a;f.find(".col").remove();for(a=0;a<b.cols;a++){var c=$("\x3cdiv class\x3dcol/\x3e");f.append(c);k.add(c);a!=b.cols-1&&c.css({marginRight:b.colSpace})}f.css({width:(224+
b.colSpace)*b.cols-b.colSpace});b.colIndex=0;f.find(".post").remove();a=b.posts.clone();b.posts.clear();b.addPosts(a)}};b.addPost=function(a){isString(a.publishTime)&&(a.publishTime=fs.util.DateTimeUtil.parseServerTime(a.publishTime));b.posts.add(a);b.colIndex==b.cols&&(b.colIndex=0);var c=k[b.colIndex],d=fs.app.subscriptionAgent.channels[a.cid],e=$("\x3cdiv class\x3dpost\x3e");e.data("post",a);e.attr("id",a._id);var g=$("\x3cimg id\x3dthumb\x3e");g.on("error",m);g.attr({src:notEmpty(a.image)?a.image.url:
b.getResourcePath("images.post-thumb-placeholder","png")});e.append(g);g=$("\x3cdiv id\x3dtitle\x3e");g.text(a.title);e.append(g);b.$container.append(e);var g=$("\x3cdiv id\x3dinfo\x3e"),f=$("\x3ca id\x3dchannel\x3e");f.text(d.title);f.attr("title",d.title);g.append(f);d=$("\x3cdiv id\x3dtime\x3e");d.text(fs.util.DateTimeUtil.getShortString(a.publishTime));d.attr("title",a.publishTime.toLocaleString());g.append(d);e.append(g);c.append(e);b.colIndex++};b.addPosts=function(a){a.forEach(function(a){b.addPost(a)})};
b.setPosts=function(a){b.clear();b.addPosts(a)};b.clear=function(a){b.pageIndex=0;b.colIndex=0;null!==f&&f.find(".post").remove();b.posts.clear()};return b.endOfClass(arguments)};fs.view.PostListView.className="fs.view.PostListView";