//
//  FSChannelSideViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSChannelSideViewController.h"
#import "FSChannelListViewController.h"

@interface FSChannelSideViewController ()

@end

@implementation FSChannelSideViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // Do any additional setup after loading the view.
    FSChannelListViewController *listViewController = [[FSChannelListViewController alloc] initWithStyle:UITableViewStylePlain];
    listViewController.tableView.frame = self.view.bounds;
    listViewController.tableView.backgroundColor = [UIColor clearColor];
    listViewController.tableView.autoresizingMask = UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleHeight;
    [self addChildViewController:listViewController];
    [self.view addSubview:listViewController.tableView];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
