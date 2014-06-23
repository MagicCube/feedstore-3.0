//
//  FSNavigatableViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSNavigatableViewController.h"

@interface FSNavigatableViewController ()

- (void)_changeContentView;

@end

@implementation FSNavigatableViewController

@synthesize contentView = _contentView;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    if (_contentView == nil && _contentViewController != nil)
    {
        self.contentView = _contentViewController.view;
    }
    else
    {
        [self _changeContentView];
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)setContentView:(UIView *)contentView
{
    _contentView = contentView;
    
    [self _changeContentView];
}

- (void)_changeContentView
{
    while (self.view.subviews.count > 0)
    {
        [self.view.subviews[0] removeFromSuperview];
    }
    
    CGFloat top = self.navigationController.navigationBar.frame.origin.y + self.navigationController.navigationBar.frame.size.height;
    _contentView.frame = CGRectMake(0, top, self.navigationController.navigationBar.frame.size.width, self.navigationController.view.frame.size.height - top);
    [self.view addSubview:_contentView];
}

@end
