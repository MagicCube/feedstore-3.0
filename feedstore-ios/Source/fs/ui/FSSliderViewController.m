//
//  SliderViewController.m
//  LeftRightSlider
//
//  Created by heroims on 13-11-27.
//  Copyright (c) 2013年 heroims. All rights reserved.
//

#import "FSSliderViewController.h"
#import <sys/utsname.h>

typedef NS_ENUM(NSInteger, RMoveDirection) {
    RMoveDirectionLeft = 0,
    RMoveDirectionRight
};

@interface FSSliderViewController ()<UIGestureRecognizerDelegate>{
    UIView *_mainContentView;
    UIView *_leftSideView;
    UIView *_rightSideView;
    
    NSMutableDictionary *_subControllers;
    
    UITapGestureRecognizer *_tapGestureRec;
    UIPanGestureRecognizer *_panGestureRec;
    
    BOOL showingLeft;
    BOOL showingRight;
}

@end

@implementation FSSliderViewController

-(void)dealloc{
#if __has_feature(objc_arc)
    _mainContentView = nil;
    _leftSideView = nil;
    _rightSideView = nil;
    
    _subControllers = nil;
    
    _tapGestureRec = nil;
    _panGestureRec = nil;
    
    _leftViewController = nil;
    _rightViewController = nil;
    _mainViewController = nil;
#else
    [_mainContentView release];
    [_leftSideView release];
    [_rightSideView release];
    
    [_controllersDict release];
    
    [_tapGestureRec release];
    [_panGestureRec release];
    
    [_LeftVC release];
    [_RightVC release];
    [_MainVC release];
    [super dealloc];
#endif

}

+ (FSSliderViewController*)sharedInstance
{
    static FSSliderViewController *sharedSVC;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSVC = [[self alloc] init];
    });
    
    return sharedSVC;
}

- (id)initWithCoder:(NSCoder *)decoder {
	if ((self = [super initWithCoder:decoder])) {
        _leftSContentOffset=160;
        _rightSContentOffset=160;
        _leftSContentScale=0.85;
        _rightSContentScale=0.85;
        _leftSJudgeOffset=100;
        _rightSJudgeOffset=100;
        _leftSOpenDuration=0.4;
        _rightSOpenDuration=0.4;
        _leftSCloseDuration=0.3;
        _rightSCloseDuration=0.3;
        _canShowLeft=YES;
        _canShowRight=YES;
	}
	return self;
}

- (id)init{
    if (self = [super init]){
        _leftSContentOffset=160;
        _rightSContentOffset=160;
        _leftSContentScale=0.85;
        _rightSContentScale=0.85;
        _leftSJudgeOffset=100;
        _rightSJudgeOffset=100;
        _leftSOpenDuration=0.4;
        _rightSOpenDuration=0.4;
        _leftSCloseDuration=0.3;
        _rightSCloseDuration=0.3;
        _canShowLeft=YES;
        _canShowRight=YES;
    }
        
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.navigationController.navigationBarHidden=YES;

    _subControllers = [[NSMutableDictionary alloc] init];
    
    [self initSubviews];

    [self initChildControllers:_leftViewController rightVC:_rightViewController];
    
    [self showContentControllerWithModel:_mainViewController!=nil?NSStringFromClass([_mainViewController class]):@"MainViewController"];
    
    _rightSideView.frame=[UIScreen mainScreen].bounds;
    _leftSideView.frame=[UIScreen mainScreen].bounds;
    _mainContentView.frame=[UIScreen mainScreen].bounds;

    _tapGestureRec = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(closeSideBar)];
    _tapGestureRec.delegate=self;
    [self.view addGestureRecognizer:_tapGestureRec];
    _tapGestureRec.enabled = NO;
    
    _panGestureRec = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(moveViewWithGesture:)];
    [_mainContentView addGestureRecognizer:_panGestureRec];
    
}

#pragma mark - Init

- (void)initSubviews
{
    _rightSideView = [[UIView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:_rightSideView];
    
    _leftSideView = [[UIView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:_leftSideView];
    
    _mainContentView = [[UIView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:_mainContentView];

}

- (void)initChildControllers:(UIViewController*)leftVC rightVC:(UIViewController*)rightVC
{
    if (_canShowRight&&rightVC!=nil) {
        [self addChildViewController:rightVC];
        rightVC.view.frame=CGRectMake(0, 0, rightVC.view.frame.size.width, rightVC.view.frame.size.height);
        [_rightSideView addSubview:rightVC.view];
    }
    if (_canShowLeft&&leftVC!=nil) {
        [self addChildViewController:leftVC];
        leftVC.view.frame=CGRectMake(0, 0, leftVC.view.frame.size.width, leftVC.view.frame.size.height);
        [_leftSideView addSubview:leftVC.view];
    }
}

#pragma mark - Actions

- (void)showContentControllerWithModel:(NSString *)className
{
    [self closeSideBar];
    
    UIViewController *controller = _subControllers[className];
    if (!controller)
    {
        Class c = NSClassFromString(className);
        
#if __has_feature(objc_arc)
        controller = [[c alloc] init];
#else
        controller = [[[c alloc] init] autorelease];
#endif
        [_subControllers setObject:controller forKey:className];
    }
    
    if (_mainContentView.subviews.count > 0)
    {
        UIView *view = [_mainContentView.subviews firstObject];
        [view removeFromSuperview];
    }
    
    controller.view.frame = _mainContentView.frame;
    [_mainContentView addSubview:controller.view];
    
    self.mainViewController = controller;
}

- (void)showLeftViewController
{
    if (showingLeft) {
        [self closeSideBar];
        return;
    }
    if (!_canShowLeft||_leftViewController==nil) {
        return;
    }
    CGAffineTransform conT = [self transformWithDirection:RMoveDirectionRight];
    
    [self.view sendSubviewToBack:_rightSideView];
    [self configureViewShadowWithDirection:RMoveDirectionRight];
    
    [UIView animateWithDuration:_leftSOpenDuration
                     animations:^{
                         _mainContentView.transform = conT;
                     }
                     completion:^(BOOL finished) {
                         _tapGestureRec.enabled = YES;
                         showingLeft=YES;
                         _mainViewController.view.userInteractionEnabled=NO;
                     }];
}

- (void)showRightViewController
{
    if (showingRight) {
        [self closeSideBar];
        return;
    }
    if (!_canShowRight||_rightViewController==nil) {
        return;
    }
    CGAffineTransform conT = [self transformWithDirection:RMoveDirectionLeft];
    
    [self.view sendSubviewToBack:_leftSideView];
    [self configureViewShadowWithDirection:RMoveDirectionLeft];
    
    [UIView animateWithDuration:_rightSOpenDuration
                     animations:^{
                         _mainContentView.transform = conT;
                     }
                     completion:^(BOOL finished) {
                         _tapGestureRec.enabled = YES;
                         showingRight=YES;
                         _mainViewController.view.userInteractionEnabled=NO;
                     }];
}

- (void)closeSideBar
{
    CGAffineTransform oriT = CGAffineTransformIdentity;
    [UIView animateWithDuration:_mainContentView.transform.tx==_leftSContentOffset?_leftSCloseDuration:_rightSCloseDuration
                     animations:^{
                         _mainContentView.transform = oriT;
                     }
                     completion:^(BOOL finished) {
                         _tapGestureRec.enabled = NO;
                         showingRight=NO;
                         showingLeft=NO;
                         _mainViewController.view.userInteractionEnabled=YES;
                     }];
}

- (void)moveViewWithGesture:(UIPanGestureRecognizer *)panGes
{
    static CGFloat currentTranslateX;
    if (panGes.state == UIGestureRecognizerStateBegan)
    {
        currentTranslateX = _mainContentView.transform.tx;
    }
    if (panGes.state == UIGestureRecognizerStateChanged)
    {
        CGFloat transX = [panGes translationInView:_mainContentView].x;
        transX = transX + currentTranslateX;
        
        CGFloat sca=0;
        if (transX > 0)
        {
            if (!_canShowLeft||_leftViewController==nil) {
                return;
            }

            [self.view sendSubviewToBack:_rightSideView];
            [self configureViewShadowWithDirection:RMoveDirectionRight];
            
            if (_mainContentView.frame.origin.x < _leftSContentOffset)
            {
                sca = 1 - (_mainContentView.frame.origin.x/_leftSContentOffset) * (1-_leftSContentScale);
            }
            else
            {
                sca = _leftSContentScale;
            }
        }
        else    //transX < 0
        {
            if (!_canShowRight||_rightViewController==nil) {
                return;
            }

            [self.view sendSubviewToBack:_leftSideView];
            [self configureViewShadowWithDirection:RMoveDirectionLeft];
            
            if (_mainContentView.frame.origin.x > -_rightSContentOffset)
            {
                sca = 1 - (-_mainContentView.frame.origin.x/_rightSContentOffset) * (1-_rightSContentScale);
            }
            else
            {
                sca = _rightSContentScale;
            }
        }
        CGAffineTransform transS = CGAffineTransformMakeScale(sca, sca);
        CGAffineTransform transT = CGAffineTransformMakeTranslation(transX, 0);
        
        CGAffineTransform conT = CGAffineTransformConcat(transT, transS);
        
        _mainContentView.transform = conT;
    }
    else if (panGes.state == UIGestureRecognizerStateEnded)
    {
        CGFloat panX = [panGes translationInView:_mainContentView].x;
        CGFloat finalX = currentTranslateX + panX;
        if (finalX > _leftSJudgeOffset)
        {
            if (!_canShowLeft||_leftViewController==nil) {
                return;
            }

            CGAffineTransform conT = [self transformWithDirection:RMoveDirectionRight];
            [UIView beginAnimations:nil context:nil];
            _mainContentView.transform = conT;
            [UIView commitAnimations];
            
            showingLeft=YES;
            _mainViewController.view.userInteractionEnabled=NO;

            _tapGestureRec.enabled = YES;
            return;
        }
        if (finalX < -_rightSJudgeOffset)
        {
            if (!_canShowRight||_rightViewController==nil) {
                return;
            }

            CGAffineTransform conT = [self transformWithDirection:RMoveDirectionLeft];
            [UIView beginAnimations:nil context:nil];
            _mainContentView.transform = conT;
            [UIView commitAnimations];
            
            showingRight=YES;
            _mainViewController.view.userInteractionEnabled=NO;

            _tapGestureRec.enabled = YES;
            return;
        }
        else
        {
            CGAffineTransform oriT = CGAffineTransformIdentity;
            [UIView beginAnimations:nil context:nil];
            _mainContentView.transform = oriT;
            [UIView commitAnimations];
            
            showingRight=NO;
            showingLeft=NO;
            _mainViewController.view.userInteractionEnabled=YES;
            _tapGestureRec.enabled = NO;
        }
    }
}

#pragma mark -

- (CGAffineTransform)transformWithDirection:(RMoveDirection)direction
{
    CGFloat translateX = 0;
    CGFloat transcale = 0;
    switch (direction) {
        case RMoveDirectionLeft:
            translateX = -_rightSContentOffset;
            transcale = _rightSContentScale;
            break;
        case RMoveDirectionRight:
            translateX = _leftSContentOffset;
            transcale = _leftSContentScale;
            break;
        default:
            break;
    }
    
    CGAffineTransform transT = CGAffineTransformMakeTranslation(translateX, 0);
    CGAffineTransform scaleT = CGAffineTransformMakeScale(transcale, transcale);
    CGAffineTransform conT = CGAffineTransformConcat(transT, scaleT);
    
    return conT;
}

- (NSString*)deviceWithNumString{
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceString = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    
    @try {
        return [deviceString stringByReplacingOccurrencesOfString:@"," withString:@""];
    }
    @catch (NSException *exception) {
        return deviceString;
    }
    @finally {
    }
}

- (void)configureViewShadowWithDirection:(RMoveDirection)direction
{
    if ([[self deviceWithNumString] hasPrefix:@"iPhone"]&&[[[self deviceWithNumString] stringByReplacingOccurrencesOfString:@"iPhone" withString:@""] floatValue]<40) {
        return;
    }
    if ([[self deviceWithNumString] hasPrefix:@"iPod"]&&[[[self deviceWithNumString] stringByReplacingOccurrencesOfString:@"iPod" withString:@""] floatValue]<40) {
        return;
    }
    if ([[self deviceWithNumString] hasPrefix:@"iPad"]&&[[[self deviceWithNumString] stringByReplacingOccurrencesOfString:@"iPad" withString:@""] floatValue]<25) {
        return;
    }

    CGFloat shadowW;
    switch (direction)
    {
        case RMoveDirectionLeft:
            shadowW = 2.0f;
            break;
        case RMoveDirectionRight:
            shadowW = -2.0f;
            break;
        default:
            break;
    }
    _mainContentView.layer.shadowOffset = CGSizeMake(shadowW, 1.0);
    _mainContentView.layer.shadowColor = [UIColor blackColor].CGColor;
    _mainContentView.layer.shadowOpacity = 0.8f;
}


- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch
{    
    if ([NSStringFromClass([touch.view class]) isEqualToString:@"UITableViewCellContentView"]) {
        return NO;
    }
    return  YES;
}

@end
