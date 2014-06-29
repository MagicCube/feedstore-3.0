//
//  FSRootViewController.h
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FSSideBarController.h"

@class FSNavigationController;
@class FSHomeViewController;
@class FSChannelSideViewController;

@interface FSRootViewController : FSSideBarController

@property (strong, nonatomic, readonly) FSNavigationController *navigationController;
@property (weak, nonatomic, readonly) FSHomeViewController *homeViewController;
@property (strong, nonatomic, readonly) FSChannelSideViewController *channelSideViewController;

+ (FSRootViewController*)sharedInstance;

@end
