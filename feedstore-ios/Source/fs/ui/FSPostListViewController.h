//
//  FSPostListViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>
@class FSPostDetailViewController;

@interface FSPostListViewController : UITableViewController

@property (nonatomic) NSInteger pageIndex;
@property (nonatomic) NSInteger pageSize;
@property (strong, nonatomic, readonly) NSMutableArray *posts;
@property (strong, nonatomic, readonly) UIActivityIndicatorView *footerActivityIndicatorView;
@property (strong, nonatomic, readonly) FSPostDetailViewController *detailViewController;

+ (FSPostListViewController*)sharedInstance;
- (void)nextPageWithCallback:(void (^)())callback;
- (void)refreshWithCallback:(void (^)())callback;
- (void)refresh;

@end
