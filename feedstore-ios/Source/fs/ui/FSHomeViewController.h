//
//  FSHomeViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSNavigatableViewController.h"
@class FSPostListViewController;

@interface FSHomeViewController : FSNavigatableViewController

@property (weak, nonatomic, readonly) FSPostListViewController *postListViewController;

+ (FSHomeViewController*)sharedInstance;

@end
