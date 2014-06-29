//
//  FSPostListViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "NSString+HTML.h"
#import "FSPostDetailViewController.h"
#import "FSPostListViewController.h"
#import "FSListViewCell.h"
#import "FSListViewGallaryCell.h"
#import "FSListViewTextCell.h"
#import "FSListViewTextPhotoCell.h"
#import "FSPostAgent.h"

@interface FSPostListViewController ()

- (Class)tableView:(UITableView *)tableView classForRowAtIndexPath:(NSIndexPath *)indexPath;
- (NSString *)flattenHTML:(NSString *)html;

@end

@implementation FSPostListViewController

@synthesize pageIndex = _pageIndex;
@synthesize pageSize = _pageSize;
@synthesize posts = _posts;
@synthesize detailViewController = _detailViewController;
@synthesize footerActivityIndicatorView = _footerActivityIndicatorView;

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        self.clearsSelectionOnViewWillAppear = YES;
        
        _posts = [NSMutableArray arrayWithArray:@[]];
        _pageIndex = 0;
        _pageSize = [((NSNumber *)([FSConfig settingWithKey:@"fs.ui.postlist.pagesize"])) integerValue];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.tableView.rowHeight = 116;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    
    self.refreshControl = [[UIRefreshControl alloc] init];
    [self.refreshControl addTarget:self action:@selector(refresh) forControlEvents:UIControlEventValueChanged];
    
    _footerActivityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    self.tableView.tableFooterView = _footerActivityIndicatorView;
    
    [self refresh];
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
                return FSListViewGallaryCell.class;
            }
            else
            {
                return FSListViewTextPhotoCell.class;
            }
        }
        else
        {
            return FSListViewTextPhotoCell.class;
        }
    }
    else
    {
        return FSListViewTextCell.class;
    }
}


- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    Class cls = [self tableView:self.tableView classForRowAtIndexPath:indexPath];
    if (cls == FSListViewTextPhotoCell.class)
    {
        return self.tableView.rowHeight;
    }
    else
    {
        return self.tableView.rowHeight;
    }
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *post = _posts[indexPath.row];
    
    Class cls = [self tableView:self.tableView classForRowAtIndexPath:indexPath];
    NSString *clsName = NSStringFromClass(cls);
    
    FSListViewCell *cell = [tableView dequeueReusableCellWithIdentifier:clsName];
    if (cell == nil)
    {
        cell = [cls alloc];
        cell = [cell initWithStyle:UITableViewCellStyleDefault reuseIdentifier:clsName];
    }
    [cell renderPost:post];
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSMutableDictionary *post = _posts[indexPath.row];
    if (_detailViewController == nil)
    {
        _detailViewController = [[FSPostDetailViewController alloc] init];
    }
    [self.navigationController pushViewController:_detailViewController animated:YES];
    [_detailViewController renderPost:post];
    [self.tableView deselectRowAtIndexPath:indexPath animated:YES];
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
     if (self.posts.count >= 5 && indexPath.row == self.posts.count - 1)
     {
         [_footerActivityIndicatorView startAnimating];
         [self nextPageWithCallback:^{
             [_footerActivityIndicatorView stopAnimating];
         }];
     }
}

- (void)nextPageWithCallback:(void (^)())callback
{
    [[FSPostAgent sharedInstance] queryPostsAtPage:_pageIndex withPageSize:_pageSize callback:^(NSError *error, id results)
    {
        NSMutableArray *posts = results[@"posts"];
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
    [_posts removeAllObjects];
    
    [self.refreshControl beginRefreshing];
    [self nextPageWithCallback:^
    {
        self.tableView.separatorStyle = UITableViewCellSeparatorStyleSingleLine;
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
