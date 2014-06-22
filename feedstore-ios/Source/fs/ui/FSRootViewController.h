//
//  FSRootViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FSNavigationController;
@class FSHomeViewController;

@interface FSRootViewController : UIViewController

@property (strong, nonatomic, readonly) FSNavigationController *navigationController;
@property (strong, nonatomic, readonly) FSHomeViewController *homeViewController;

@end
