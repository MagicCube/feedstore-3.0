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
        self.title = @"FeedStore";
    }
    return self;
}

+ (FSHomeViewController*)sharedInstance
{
    static FSHomeViewController *sharedInstance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    _postListViewController = [FSPostListViewController sharedInstance];
    self.contentViewController = _postListViewController;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

@end
