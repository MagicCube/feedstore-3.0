//
//  FSWebViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-24.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FSWebViewController : UIViewController <UIWebViewDelegate>

@property (strong, nonatomic, readonly) UIWebView *webView;
@property (strong, nonatomic, readonly) UIActivityIndicatorView *activityIndicatorView;

+ (FSWebViewController*)sharedInstance;
- (void)navigateToURL:(NSURL *)URL;

@end
