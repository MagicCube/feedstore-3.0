//
//  FSPostDetailViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSNavigatableViewController.h"
#import "DTCoreText.h"
@class DTAttributedLabel;
@class FSWebViewController;

@interface FSPostDetailViewController : FSNavigatableViewController <DTAttributedTextContentViewDelegate>

@property (copy, nonatomic, readonly) NSURL *linkURL;
@property (strong, nonatomic, readonly) DTAttributedTextView *contentView;
@property (strong, nonatomic, readonly) UIScrollView *scrollView;
@property (strong, nonatomic, readonly) FSWebViewController *webViewController;

- (void)renderPost:(NSMutableDictionary *)post;

@end
