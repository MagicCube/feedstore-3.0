//
//  FSHomeViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-22.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSHomeViewController.h"
#import "FSPostListViewController.h"

@interface FSHomeViewController ()

@end

@implementation FSHomeViewController

@synthesize postListViewController = _postListViewController;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        _postListViewController = [[FSPostListViewController alloc] init];
        self.contentViewController = _postListViewController;
        self.title = @"FeedStore";
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

@end
