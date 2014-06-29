//
//  FSChannelListViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSChannelListViewController.h"
#import "FSListViewGallaryCell.h"
#import "FSPostListViewController.h"
#import "FSRootViewController.h"

@interface FSChannelListViewController ()

@end

@implementation FSChannelListViewController

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self)
    {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.tableView.backgroundColor = [UIColor clearColor];
    self.tableView.separatorColor = rgba(255, 255, 255, 0.3);
    
    UIView *headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, 70)];
    UILabel *headerLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 4, self.view.frame.size.width, headerView.frame.size.height)];
    headerLabel.text = @"频道";
    headerLabel.font = [UIFont systemFontOfSize:42];
    headerLabel.textColor = rgba(255, 255, 255, 0.4);
    [headerView addSubview:headerLabel];
    self.tableView.tableHeaderView = headerView;
    
    self.clearsSelectionOnViewWillAppear = NO;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    [self.tableView reloadData];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [FSChannelAgent sharedInstance].channels.count + 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"ChannelRow"];
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"ChannelRow"];
        cell.textLabel.textColor = rgba(255, 255, 255, 0.8);
        cell.backgroundColor = [UIColor clearColor];
    }
    
    if (indexPath.row == 0)
    {
        cell.textLabel.text = @"所有频道";
        cell.textLabel.font = [UIFont boldSystemFontOfSize:20];
    }
    else
    {
        NSDictionary *channel = [FSChannelAgent sharedInstance].channels[indexPath.row - 1];
        cell.textLabel.text = channel[@"title"];
        cell.textLabel.font = [UIFont systemFontOfSize:15];
    }
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self.tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    [[FSRootViewController sharedInstance] hideSideBarAnimated:YES];
    
    NSString *channelId = nil;
    if (indexPath.row != 0)
    {
        NSDictionary *channel = [FSChannelAgent sharedInstance].channels[indexPath.row - 1];
        channelId = channel[@"_id"];
    }
    [FSPostListViewController sharedInstance].channelId = channelId;
    [[FSPostListViewController sharedInstance] refresh];
}
@end
