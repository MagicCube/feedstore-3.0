//
//  FSPostDetailViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSNavigatableViewController.h"
@class FSWebViewController;

@interface FSPostDetailViewController : FSNavigatableViewController <UIWebViewDelegate>

@property (copy, nonatomic, readonly) NSString *postTitle;
@property (copy, nonatomic, readonly) UIImage *postImage;
@property (copy, nonatomic, readonly) NSURL *postLinkURL;
@property (strong, nonatomic, readonly) UIWebView *contentView;

- (void)renderPost:(NSMutableDictionary *)post;

@end
