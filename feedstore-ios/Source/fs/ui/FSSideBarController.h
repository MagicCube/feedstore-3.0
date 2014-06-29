//
//  FSSideBarController.h
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FSSideBarController : UIViewController <UIGestureRecognizerDelegate>

@property (strong, nonatomic) UIView *backgroundView;
@property (weak, nonatomic) UIViewController *mainViewController;
@property (weak, nonatomic) UIViewController *leftSideViewController;

@property (nonatomic, assign) CGFloat leftSideWidth;
@property (nonatomic, assign) BOOL swipeToShowSideBar;

- (void)showLeftSideAnimated:(BOOL)animated;
- (void)hideSideBarAnimated:(BOOL)animated;

@end
