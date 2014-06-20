/* Fri Jun 20 10:55:09 CST 2014 */
/* Generated by MagicCube MXBuild with MXFramework */
$ns("fs");$import("fs.biz.PostAgent");$import("fs.biz.SubscriptionAgent");$import("fs.util.DateTimeUtil");$import("fs.view.PostListView");
fs.App=function(){var a=$extend(mx.app.Application);a.appId="fs.App";a.appDisplayName="MagicCube FeedStore";var c={};a.subscriptionAgent=null;a.postAgent=null;a.postListView=null;c.init=a.init;a.init=function(d){c.init(d);a.subscriptionAgent=new fs.biz.SubscriptionAgent;a.postAgent=new fs.biz.PostAgent;a.postListView=new fs.view.PostListView({id:"postList"});a.postListView.css({marginTop:62});a.addSubview(a.postListView)};c.run=a.run;a.run=function(d){a.subscriptionAgent.load().done(function(){a.postListView.load()})};
a.getServiceUrl=function(a){return $mappath("~/api"+a)};return a.endOfClass(arguments)};fs.App.className="fs.App";$ns("fs.biz");fs.biz.PostAgent=function(){var a=$extend(MXComponent),c={};c.init=a.init;a.init=function(a){c.init(a)};a.queryPosts=function(a){a=$.extend({pageIndex:0,pageSize:50},a);return $.ajax({url:fs.app.getServiceUrl("/posts/"),data:a})};return a.endOfClass(arguments)};fs.biz.PostAgent.className="fs.biz.PostAgent";$ns("fs.biz");fs.biz.SubscriptionAgent=function(){var a=$extend(MXComponent),c={};a.channels=[];c.init=a.init;a.init=function(a){c.init(a)};a.addChannel=function(c){a.channels.add(c);a.channels[c._id]=c;a.channels[c.cid]=c};a.load=function(){var c=$.Deferred();$.ajax({url:fs.app.getServiceUrl("/subscriptions/")}).done(function(b){b.forEach(function(b){a.addChannel(b)});c.resolve()});return c};return a.endOfClass(arguments)};fs.biz.SubscriptionAgent.className="fs.biz.SubscriptionAgent";$ns("fs.util");fs.util.DateTimeUtilClass=function(){var a=$extend(MXObject);a.parseServerTime=function(a){return new Date(a)};a.getShortString=function(a){var d=Date.now();return a>d-6E4?"\u521a\u521a":a>d-36E5?Math.round((d-a)/1E3/60)+" \u5206\u949f\u524d":a>d-864E5?Math.round((d-a)/1E3/60/60)+" \u5c0f\u65f6\u524d":a>d-1728E5?"\u6628\u5929":a>d-2592E5?"\u524d\u5929":$format(a,"M\u6708d\u65e5")};return a.endOfClass(arguments)};fs.util.DateTimeUtil=new fs.util.DateTimeUtilClass;
fs.util.DateTimeUtilClass.className="fs.util.DateTimeUtilClass";$ns("fs.view");$include("fs.res.PostListView.css");
fs.view.PostListView=function(){function a(){b.loading||(b.pageIndex++,b.loading=isEmpty(void 0)?!0:!1,fs.app.postAgent.queryPosts({pageIndex:b.pageIndex,pageSize:b.pageSize}).done(function(a){b.loading=isEmpty(!1)?!0:!1;b.addPosts(a)}))}function c(){document.body.scrollTop+document.body.offsetHeight>document.body.scrollHeight-50&&a()}function d(a){b.frame.height=b.$container.height();b.frame.width!==b.$container.width()&&(b.frame.width=b.$container.width(),b.resetCols(),c())}var b=$extend(mx.view.View);
b.elementClass="PostListView";b.frame={};var k={};b.posts=[];b.cols=0;b.colIndex=0;b.pageIndex=0;b.pageSize=50;b.colSpace=12;var g=[],e=null;k.init=b.init;b.init=function(a){k.init(a)};b.load=function(){d();b.clear();a()};b.resetCols=function(){var a=Math.floor(b.frame.width/(224+b.colSpace));if(b.cols!==a){null===e&&(e=$("\x3cdiv class\x3dcolgroup\x3e"),b.$container.append(e));g.clear();b.cols=a;e.find(".col").remove();for(a=0;a<b.cols;a++){var c=$("\x3cdiv class\x3dcol/\x3e");e.append(c);g.add(c);
a!=b.cols-1&&c.css({marginRight:b.colSpace})}e.css({width:(224+b.colSpace)*b.cols-b.colSpace});b.colIndex=-1;e.find(".post").remove();a=b.posts.clone();b.posts.clear();b.addPosts(a)}};b.addPost=function(a){isString(a.publishTime)&&(a.publishTime=fs.util.DateTimeUtil.parseServerTime(a.publishTime));b.posts.add(a);b.colIndex++;b.colIndex==b.cols&&(b.colIndex=0);var c=g[b.colIndex],d=fs.app.subscriptionAgent.channels[a.cid],e=$("\x3cdiv class\x3dpost\x3e");e.attr("id",a._id);var f=$("\x3cdiv id\x3dthumb\x3e");
e.append(f);f=$("\x3cdiv id\x3dtitle\x3e");f.text(a.title);e.append(f);b.$container.append(e);var f=$("\x3cdiv id\x3dinfo\x3e"),h=$("\x3ca id\x3dchannel\x3e");h.text(d.title);h.attr("title",d.title);f.append(h);d=$("\x3cdiv id\x3dtime\x3e");d.text(fs.util.DateTimeUtil.getShortString(a.publishTime));d.attr("title",a.publishTime.toLocaleString());f.append(d);e.append(f);c.append(e)};b.addPosts=function(a){a.forEach(function(a){b.addPost(a)})};b.setPosts=function(a){b.clear();b.addPosts(a)};b.clear=
function(a){b.pageIndex=-1;b.colIndex=-1;null!==e&&e.find(".post").remove();b.posts.clear()};$(window).on("resize",d);$(window).on("scroll",function(a){c()});return b.endOfClass(arguments)};fs.view.PostListView.className="fs.view.PostListView";