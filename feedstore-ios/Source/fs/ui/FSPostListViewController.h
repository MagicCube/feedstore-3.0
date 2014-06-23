//
//  FSPostListViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FSPostListViewController : UITableViewController

@property (strong, nonatomic, readonly) NSMutableArray *posts;
@property (nonatomic) NSInteger pageIndex;
@property (nonatomic) NSInteger pageSize;

- (void)nextPageWithCallback:(void (^)())callback;
- (void)refreshWithCallback:(void (^)())callback;
- (void)refresh;

@end
