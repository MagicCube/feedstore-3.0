//
//  FSNavigatableViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSNavigatableViewController.h"

@interface FSNavigatableViewController ()

- (void)changeContentViewController;

@end

@implementation FSNavigatableViewController

@synthesize contentViewController = _contentViewController;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {

    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    [self changeContentViewController];
    
    self.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"" style:UIBarButtonItemStylePlain target:nil action:nil];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (UIView *)contentView
{
    return _contentViewController.view;
}

- (void)setContentViewController:(UIViewController *)contentViewController
{
    _contentViewController = contentViewController;
    [self changeContentViewController];
}

- (void)changeContentViewController
{
    while (self.view.subviews.count > 0)
    {
        [self.view.subviews[0] removeFromSuperview];
    }
 
    if (_contentViewController != nil)
    {
        [self.view addSubview:self.contentView];
        [self addChildViewController:_contentViewController];

        self.contentView.frame = CGRectMake(0, 0, self.navigationController.navigationBar.frame.size.width, self.navigationController.view.frame.size.height);
    }
}

@end
