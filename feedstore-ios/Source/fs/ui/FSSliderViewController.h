//
//  SliderViewController.h
//  LeftRightSlider
//
//  Created by Zhao Yiqi on 13-11-27.
//  Copyright (c) 2013年 Zhao Yiqi. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FSSliderViewController : UIViewController

@property(nonatomic,strong)UIViewController *leftViewController;
@property(nonatomic,strong)UIViewController *rightViewController;
@property(nonatomic,strong)UIViewController *mainViewController;

@property(nonatomic,strong)NSMutableDictionary *subControllers;

@property(nonatomic,assign)float leftSContentOffset;
@property(nonatomic,assign)float rightSContentOffset;

@property(nonatomic,assign)float leftSContentScale;
@property(nonatomic,assign)float rightSContentScale;

@property(nonatomic,assign)float leftSJudgeOffset;
@property(nonatomic,assign)float rightSJudgeOffset;

@property(nonatomic,assign)float leftSOpenDuration;
@property(nonatomic,assign)float rightSOpenDuration;

@property(nonatomic,assign)float leftSCloseDuration;
@property(nonatomic,assign)float rightSCloseDuration;

@property(nonatomic,assign)BOOL canShowLeft;
@property(nonatomic,assign)BOOL canShowRight;

+ (FSSliderViewController*)sharedSliderController;

- (void)showContentControllerWithModel:(NSString*)className;
- (void)showLeftViewController;
- (void)showRightViewController;

@end
