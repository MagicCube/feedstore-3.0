![](https://raw.githubusercontent.com/MagicCube/feedstore-3.0/master/design/promotion-01.jpg)
![](https://raw.githubusercontent.com/MagicCube/feedstore-3.0/master/design/promotion-02.jpg)

# MagicCube FeedStore 3.0
MagicCube FeedStore 3.0 是一款集 RSS 聚合服务端、Web 客户端和 iOS 移动客户端为一体的私人定制阅读解决方案。

## 在线运行
百度开放平台 - [http://feedstore.duapp.com/](http://feedstore.duapp.com/)

## 开发与部署
从3.0开始，FeedStore 服务端采用了全新的 Node.js + MongoDB 底层开发，将部署在百度开放平台上。
* FeedStore Web 客户端采用 [MagicCube MXFramework](https://github.com/MagicCube/mxframework-core) 开发。
* FeedStore 服务端采用 [MagicCube MXFramework for Node](https://github.com/MagicCube/mxframework-node) 开发。

## 工程结构与子项目
* Node.js 服务端 - [feedstore-node](https://github.com/MagicCube/feedstore-3.0/tree/master/feedstore-node)
* Web 客户端 - [feedstore-node/public](https://github.com/MagicCube/feedstore-3.0/tree/master/feedstore-node/public)
* iOS 客户端 - [feedstore-ios](https://github.com/MagicCube/feedstore-3.0/tree/master/feedstore-ios)

## 以往版本
* [FeedStore 1.0](https://github.com/MagicCube/Former_FeedStore) - MagicCube FeedStore 原先的目标是替代原有的 Google Reader 网页端，并提供离线阅读功能。2011年首次在 Google Chrome Web Store 上线，便拥有了几千名忠实用户，其中大多数为英文版的国外用户。在 Chrome Web Store 中搜索“FeedStore”即可找到该版本的发行版。
* [FeedStore 2.0](https://github.com/MagicCube/FeedStore) - 2013年 Google Reader 在中国大陆访问开始变得非常不稳定，直至 2013年彻底被 Google 砍掉，于是开发了 Java 服务端版的 FeedStore，首次运用了NoSQL数据库，并开发了 iPhone/iPad 版的原生阅读程序。该版本部署在 Google AppEngine（[https://feedstore-01.appengine.com](https://feedstore-01.appengine.com)）上，由于 GFW 等众所周知的原因，未向公众开放。
* [FeedStore 3.0](https://github.com/MagicCube/FeedStore-3.0) - 2014年，我们重新开始，将部署在百度开放平台上。

## TO-DO
* 添加对 Channel 的查询
* 添加 Subscription Category 的查询
* 添加 SliderViewController
* 实现向右滑动查看原帖
* 实现横向 Category 导航
* 实现在 SlideViewController 中频道导航