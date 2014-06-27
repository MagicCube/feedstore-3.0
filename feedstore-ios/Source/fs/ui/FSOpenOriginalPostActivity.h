//
//  FSOriginalPostActivity.h
//  FeedStore
//
//  Created by Henry on 14-6-27.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>
@class FSWebViewController;

@interface FSOpenOriginalPostActivity : UIActivity

@property (strong, nonatomic, readonly) NSURL *originalPostURL;
@property (strong, nonatomic, readonly) FSWebViewController *webViewController;

@end
