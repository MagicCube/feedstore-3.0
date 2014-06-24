//
//  FSPostListViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "NSString+HTML.h"
#import "FSPostListViewController.h"
#import "FSPostListViewCell.h"
#import "FSPostListViewGallaryCell.h"
#import "FSPostListViewTextCell.h"
#import "FSPostListViewTextPhotoCell.h"
#import "FSServiceAgent.h"

@interface FSPostListViewController ()

- (Class)tableView:(UITableView *)tableView classForRowAtIndexPath:(NSIndexPath *)indexPath;
- (NSString *)flattenHTML:(NSString *)html;

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
        _pageSize = [((NSNumber *)([FSConfig settingWithKey:@"fs.ui.postlist.pagesize"])) integerValue];
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

- (Class)tableView:(UITableView *)tableView classForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *post = _posts[indexPath.row];
    if (post[@"textContent"] == nil)
    {
        post[@"textContent"] = [self flattenHTML:post[@"content"]];
    }

    if (post[@"image"] != nil)
    {
        NSInteger imageCount = [((NSNumber *)post[@"imageCount"]) integerValue];
        if (imageCount >= 4)
        {
            if (post[@"imageUrls"] == nil)
            {
                NSMutableArray *urls = [[NSMutableArray alloc] init];
                NSString *urlString = nil;
                NSScanner *scanner = [NSScanner scannerWithString:post[@"content"]];
                [scanner scanUpToString:@"<img" intoString:nil];
                while (![scanner isAtEnd])
                {
                    [scanner scanUpToString:@"src" intoString:nil];
                    NSCharacterSet *charset = [NSCharacterSet characterSetWithCharactersInString:@"\"'"];
                    [scanner scanUpToCharactersFromSet:charset intoString:nil];
                    [scanner scanCharactersFromSet:charset intoString:nil];
                    [scanner scanUpToCharactersFromSet:charset intoString:&urlString];
                    if ([urlString hasSuffix:@".img"])
                    {
                        continue;
                    }
                    NSURL *url = [NSURL URLWithString:urlString];
                    [urls addObject:url];
                    if (urls.count == 4)
                    {
                        break;
                    }
                }
                post[@"imageUrls"] = urls;
            }
            imageCount = ((NSMutableArray *)post[@"imageUrls"]).count;
            if (imageCount >= 4)
            {
                return FSPostListViewGallaryCell.class;
            }
            else
            {
                return FSPostListViewTextPhotoCell.class;
            }
        }
        else
        {
            return FSPostListViewTextPhotoCell.class;
        }
    }
    else
    {
        return FSPostListViewTextCell.class;
    }
}


- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    Class cls = [self tableView:self.tableView classForRowAtIndexPath:indexPath];
    if (cls == FSPostListViewTextPhotoCell.class)
    {
        return 112;
    }
    else
    {
        return 112;
    }
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *post = _posts[indexPath.row];
    
    Class cls = [self tableView:self.tableView classForRowAtIndexPath:indexPath];
    NSString *clsName = NSStringFromClass(cls);
    
    FSPostListViewCell *cell = [tableView dequeueReusableCellWithIdentifier:clsName];
    if (cell == nil)
    {
        cell = [cls alloc];
        cell = [cell initWithStyle:UITableViewCellStyleDefault reuseIdentifier:clsName];
    }
    [cell renderPost:post];
    
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







- (NSString *)flattenHTML:(NSString *)html
{
    NSString *text = [html stringByStrippingTags];
    text = [text stringByDecodingHTMLEntities];
    text = [text stringByRemovingNewLinesAndWhitespace];
    text = [text stringByReplacingOccurrencesOfString:@"　" withString:@""];
    return text;
}

@end
