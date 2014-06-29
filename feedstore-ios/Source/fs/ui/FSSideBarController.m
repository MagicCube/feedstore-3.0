//
//  FSSideBarController.m
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSSideBarController.h"

@interface FSSideBarController ()

@property (strong, nonatomic, readonly) UIView *containerView;
@property (strong, nonatomic, readonly) UITapGestureRecognizer *tapGestureRecognizer;
@property (strong, nonatomic, readonly) UIScreenEdgePanGestureRecognizer *panGestureRecognizer;

- (void)showLeftSideAnimated:(BOOL)animated duration:(CGFloat)duration initialVelocity:(CGFloat)velocity;

@end

@implementation FSSideBarController

@synthesize backgroundView = _backgroundView;
@synthesize mainViewController = _mainViewController;
@synthesize leftSideViewController = _leftSideViewController;
@synthesize leftSideWidth = _leftSideWidth;
@synthesize swipeToShowSideBar = _swipeToShowSideBar;

@synthesize containerView = _containerView;
@synthesize tapGestureRecognizer = _tapGestureRecognizer;
@synthesize panGestureRecognizer = _panGestureRecognizer;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        _leftSideWidth = 260;
    }
    return self;
}

- (void)loadView
{
    [super loadView];
    
    _backgroundView = [[UIView alloc] initWithFrame:self.view.bounds];
    UIImage *backgroundImage = [UIImage imageNamed:@"side-bar-bg-568h@2x.jpg"];
    _backgroundView.backgroundColor = [UIColor colorWithPatternImage:backgroundImage];
    [self.view addSubview:_backgroundView];
    
    _containerView = [[UIView alloc] initWithFrame:self.view.bounds];
    _containerView.autoresizingMask = UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleHeight;
    [self.view addSubview:_containerView];
    
    _panGestureRecognizer = [[UIScreenEdgePanGestureRecognizer alloc] initWithTarget:self action:@selector(panGestureRecognized:)];
    _panGestureRecognizer.edges = UIRectEdgeLeft;
    _panGestureRecognizer.delegate = self;
    _tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapGestureRecognized:)];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    if (_mainViewController != nil)
    {
        self.mainViewController = _mainViewController;
    }
    if (_leftSideViewController != nil)
    {
        self.leftSideViewController = _leftSideViewController;
    }
    
    _swipeToShowSideBar = NO;
    self.swipeToShowSideBar = YES;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (void)setSwipeToShowSideBar:(BOOL)value
{
    if (_swipeToShowSideBar != value)
    {
        _swipeToShowSideBar = value;
        
        if (_swipeToShowSideBar)
        {
            [_containerView addGestureRecognizer:_panGestureRecognizer];
        }
        else
        {
            [_containerView removeGestureRecognizer:_panGestureRecognizer];
        }
    }
}

- (void)setMainViewController:(UIViewController *)mainViewController
{
    _mainViewController = mainViewController;
    if (self.isViewLoaded)
    {
        [self addChildViewController:_mainViewController];
        
        [self.containerView addSubview:_mainViewController.view];
        _mainViewController.view.frame = _containerView.bounds;
        _mainViewController.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _mainViewController.view.layer.shadowColor = [[UIColor blackColor] CGColor];
        _mainViewController.view.layer.shadowOpacity = 0.2;
        _mainViewController.view.layer.shadowRadius = 18;
    }
}

- (void)setLeftSideViewController:(UIViewController *)leftSideViewController
{
    _leftSideViewController = leftSideViewController;
    if (self.isViewLoaded)
    {
        [self addChildViewController:_leftSideViewController];
    }
}



- (void)addLeftSideView;
{
    if (self.leftSideViewController.view.superview == nil)
    {
        CGRect menuFrame, restFrame;
        CGRectDivide(self.view.bounds, &menuFrame, &restFrame, _leftSideWidth, CGRectMinXEdge);
        self.leftSideViewController.view.frame = menuFrame;
        self.leftSideViewController.view.autoresizingMask = UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleHeight;
        [self.view insertSubview:self.leftSideViewController.view atIndex:1];
    }
}


- (void)showLeftSideAnimated:(BOOL)animated duration:(CGFloat)duration initialVelocity:(CGFloat)velocity
{
    // add menu view
    [self addLeftSideView];
    
    // animate
    __weak typeof(self) blockSelf = self;
    [UIView animateWithDuration:animated ? duration : 0.0 delay:0
         usingSpringWithDamping:0.5 initialSpringVelocity:velocity options:UIViewAnimationOptionAllowUserInteraction animations:^
         {
             blockSelf.containerView.transform = CGAffineTransformMakeTranslation(_leftSideWidth, 0);
             //self.statusBarView.transform = blockSelf.containerView.transform;
         } completion:^(BOOL completed)
         {
             [_containerView addGestureRecognizer:_tapGestureRecognizer];
         }];
}

- (void)showLeftSideAnimated:(BOOL)animated;
{
    [self showLeftSideAnimated:animated
                      duration:0.66
               initialVelocity:1.0];
}

- (void)hideSideBarAnimated:(BOOL)animated
{
    __weak typeof(self) blockSelf = self;
    [UIView animateWithDuration:0.3 animations:^
    {
        blockSelf.containerView.transform = CGAffineTransformIdentity;
        //self.statusBarView.transform = blockSelf.containerView.transform;
    } completion:^(BOOL finished)
    {
        [blockSelf.leftSideViewController.view removeFromSuperview];
    }];
}




- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)recognizer
{
    if ([recognizer isKindOfClass:[UIScreenEdgePanGestureRecognizer class]])
    {
        return YES;
    }
    return NO;
}

- (void)tapGestureRecognized:(UITapGestureRecognizer*)recognizer
{
    [self hideSideBarAnimated:YES];
}

- (void)panGestureRecognized:(UIPanGestureRecognizer*)recognizer
{
    if (!self.swipeToShowSideBar) return;
    
    CGPoint translation = [recognizer translationInView:recognizer.view];
    CGPoint velocity = [recognizer velocityInView:recognizer.view];
    
    switch (recognizer.state) {
        case UIGestureRecognizerStateBegan:
            [self addLeftSideView];
            [recognizer setTranslation:CGPointMake(recognizer.view.frame.origin.x, 0) inView:recognizer.view];
            break;

        case UIGestureRecognizerStateChanged:
            [recognizer.view setTransform:CGAffineTransformMakeTranslation(MAX(0, translation.x), 0)];
            //self.statusBarView.transform = recognizer.view.transform;
            break;

        case UIGestureRecognizerStateEnded:
        case UIGestureRecognizerStateCancelled:
            if (velocity.x > 5.0 || (velocity.x >= -1.0 && translation.x > _leftSideWidth / 3))
            {
                CGFloat transformedVelocity = velocity.x/ABS(_leftSideWidth - translation.x);
                [self showLeftSideAnimated:YES duration:0.66 initialVelocity:transformedVelocity];
            }
            else
            {
                [self hideSideBarAnimated:YES];
            }
            break;

        default:
            break;
    }
}

@end
