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
#import "FSChannelSideViewController.h"

@interface FSRootViewController ()

@end

@implementation FSRootViewController

@synthesize navigationController = _navigationController;
@synthesize homeViewController = _homeViewController;
@synthesize channelSideViewController = _channelSideViewController;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        _homeViewController = [[FSHomeViewController alloc] init];
        _navigationController = [[FSNavigationController alloc] initWithRootViewController:_homeViewController];
        _channelSideViewController = [[FSChannelSideViewController alloc] init];
        
        self.mainViewController = _navigationController;
        self.leftSideViewController = _channelSideViewController;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
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
