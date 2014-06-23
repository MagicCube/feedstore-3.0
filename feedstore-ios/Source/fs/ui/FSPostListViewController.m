//
//  FSPostListViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostListViewController.h"
#import "FSServiceAgent.h"

@interface FSPostListViewController ()

@end

@implementation FSPostListViewController

@synthesize posts = _posts;
@synthesize pageIndex = _pageIndex;
@synthesize pageSize = _pageSize;

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        _posts = [NSMutableArray arrayWithArray:@[]];
        _pageIndex = 0;
        _pageSize = 50;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.clearsSelectionOnViewWillAppear = YES;
    
    self.refreshControl = [[UIRefreshControl alloc] init];
    [self.refreshControl addTarget:self action:@selector(refresh) forControlEvents:UIControlEventValueChanged];
    
    [self refresh];
    
    // Uncomment the following line to preserve selection between presentations.
    
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return _posts.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"reuseIdentifier"];

    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"reuseIdentifier"];
    }
    
    NSDictionary *post = _posts[indexPath.row];
    cell.textLabel.text = post[@"title"];
    
    return cell;
}




- (void)nextPageWithCallback:(void (^)())callback
{
    [[FSServiceAgent sharedInstance] queryPostsAtPage:_pageIndex withPageSize:_pageSize callback:^(NSError *error, id posts)
    {
        if (((NSArray *)posts).count > 0)
        {
            [_posts addObjectsFromArray:posts];

            [self.tableView reloadData];
            
            _pageIndex++;
        }
        if (callback != nil)
        {
            callback();
        }
    }];
}

- (void)refreshWithCallback:(void (^)())callback
{
    self.pageIndex = 0;
    [self.refreshControl beginRefreshing];
    [self nextPageWithCallback:^
    {
        [self.refreshControl endRefreshing];
        
        [self.tableView reloadData];
        
        if (callback != nil)
        {
            callback();
        }
    }];
}

- (void)refresh
{
    [self refreshWithCallback:nil];
}

@end
