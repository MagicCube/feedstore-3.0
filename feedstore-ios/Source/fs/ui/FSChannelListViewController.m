//
//  FSChannelListViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSChannelListViewController.h"
#import "FSChannelAgent.h"
#import "FSListViewGallaryCell.h"

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
    
    UIView *headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, 70)];
    UILabel *headerLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 14, self.view.frame.size.width, 70)];
    headerLabel.text = @"频道";
    headerLabel.font = [UIFont systemFontOfSize:40];
    headerLabel.textColor = rgba(255, 255, 255, 0.4);
    [headerView addSubview:headerLabel];
    self.tableView.tableHeaderView = headerView;
    
    self.clearsSelectionOnViewWillAppear = NO;
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
    return [FSChannelAgent sharedInstance].channels.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"ChannelRow"];
    if (cell == nil)
    {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"ChannelRow"];
        cell.textLabel.textColor = [UIColor whiteColor];
        cell.backgroundColor = [UIColor clearColor];
    }
    
    cell.textLabel.text = [FSChannelAgent sharedInstance].channels[indexPath.row][@"title"];
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self.tableView deselectRowAtIndexPath:indexPath animated:YES];
}
@end
