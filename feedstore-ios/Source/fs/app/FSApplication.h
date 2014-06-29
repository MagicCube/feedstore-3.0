//
//  FSAppDelegate.h
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FSRootViewController;
@class FSNavigationController;

@interface FSApplication : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic, readonly) FSRootViewController *rootViewController;
@property (weak, nonatomic, readonly) FSNavigationController *navigationController;

+ (FSApplication *)sharedInstance;

@end
