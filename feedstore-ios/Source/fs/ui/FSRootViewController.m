//
//  FSRootViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSRootViewController.h"

#import "FSNavigationController.h"
#import "FSHomeViewController.h"

@interface FSRootViewController ()

@end

@implementation FSRootViewController

@synthesize navigationController = _navigationController;
@synthesize homeViewController = _homeViewController;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        
        _homeViewController = [[FSHomeViewController alloc] init];
        
        _navigationController = [[FSNavigationController alloc] initWithRootViewController:_homeViewController];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.view addSubview:_navigationController.view];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}


@end
