/* Fri Jun 20 00:34:35 CST 2014 */
/* Generated by MagicCube MXBuild with MXFramework */
$ns("fs");$import("fs.biz.PostAgent");$import("fs.biz.SubscriptionAgent");$import("fs.view.PostListView");
fs.App=function(){var b=$extend(mx.app.Application);b.appId="fs.App";b.appDisplayName="MagicCube FeedStore";var a={};b.subscriptionAgent=null;b.postAgent=null;b.postListView=null;a.init=b.init;b.init=function(c){a.init(c);b.subscriptionAgent=new fs.biz.SubscriptionAgent;b.postAgent=new fs.biz.PostAgent;b.postListView=new fs.view.PostListView({frame:{top:0,bottom:0,left:0,right:0}});b.addSubview(b.postListView)};a.run=b.run;b.run=function(a){b.subscriptionAgent.load().done(function(){b.postListView.load()})};
b.getServiceUrl=function(a){return $mappath("~/api"+a)};return b.endOfClass(arguments)};fs.App.className="fs.App";$ns("fs.biz");fs.biz.PostAgent=function(){var b=$extend(MXComponent),a={};a.init=b.init;b.init=function(b){a.init(b)};b.queryPosts=function(a){a=$.extend({pageIndex:0,pageSize:50},a);return $.ajax({url:fs.app.getServiceUrl("/posts/"),data:a})};return b.endOfClass(arguments)};fs.biz.PostAgent.className="fs.biz.PostAgent";$ns("fs.biz");fs.biz.SubscriptionAgent=function(){var b=$extend(MXComponent),a={};b.channels=[];a.init=b.init;b.init=function(b){a.init(b)};b.addChannel=function(a){b.channels.add(a);b.channels[a._id]=a;b.channels[a.cid]=a};b.load=function(){var a=$.Deferred();$.ajax({url:fs.app.getServiceUrl("/subscriptions/")}).done(function(k){k.forEach(function(a){b.addChannel(a)});a.resolve()});return a};return b.endOfClass(arguments)};fs.biz.SubscriptionAgent.className="fs.biz.SubscriptionAgent";$ns("fs.view");$include("fs.res.PostListView.css");
fs.view.PostListView=function(){function b(){a.pageIndex++;fs.app.postAgent.queryPosts({pageIndex:a.pageIndex,pageSize:a.pageSize}).done(function(b){b.forEach(function(b){b.publishTime=new Date(b.publishTime);a.colIndex++;a.colIndex==a.cols&&(a.colIndex=0);var e=k[a.colIndex],g=fs.app.subscriptionAgent.channels[b.cid],h=$("\x3cdiv class\x3dpost\x3e");h.attr("id",b._id);var d=$("\x3cdiv id\x3dthumb\x3e");h.append(d);d=$("\x3cdiv id\x3dtitle\x3e");d.text(b.title);h.append(d);a.$container.append(h);
var d=$("\x3cdiv id\x3dinfo\x3e"),f=$("\x3ca id\x3dchannel\x3e");f.text(g.title);f.attr("title",g.title);d.append(f);g=$("\x3cdiv id\x3dtime\x3e");b.publishTime>=Date.today?g.text($format(b.publishTime,"HH:mm")):g.text($format(b.publishTime,"M\u6708d\u65e5"));d.append(g);h.append(d);e.append(h)})})}var a=$extend(mx.view.View);a.elementClass="PostListView";var c={};a.cols=0;a.colIndex=0;a.pageIndex=0;a.pageSize=50;var k=[],e=null;c.init=a.init;a.init=function(a){c.init(a)};a.load=function(){a.pageIndex=
-1;a.colIndex=-1;a.frame.width=a.$container.width();a.frame.height=a.$container.height();if(0===a.cols){a.cols=Math.floor(a.frame.width/236);e=$("\x3cdiv class\x3dcolgroup\x3e");for(var f=0;f<a.cols;f++){var c=$("\x3cdiv class\x3dcol/\x3e");e.append(c);k.add(c);f!=a.cols-1&&c.css({marginRight:12})}a.$container.append(e);e.css({width:236*a.cols-12})}a.clear();b()};a.clear=function(){e.find(".post").remove()};return a.endOfClass(arguments)};fs.view.PostListView.className="fs.view.PostListView";