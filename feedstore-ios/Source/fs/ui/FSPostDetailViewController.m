//
//  FSPostDetailViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostDetailViewController.h"
#import "TUSafariActivity.h"
#import "UIImageView+AFNetworking.h"
#import "WeixinSessionActivity.h"
#import "WeixinTimelineActivity.h"
#import "CCTemplate.h"
#import "FSOpenOriginalPostActivity.h"
#import "FSNavigationController.h"
#import "FSWebViewController.h"


@interface FSPostDetailViewController ()

@property (strong, nonatomic) NSArray *activities;
@property (strong, nonatomic) NSDictionary* attributedStringOptions;
@property (strong, nonatomic) CCTemplate *templateEngine;
@property (strong, nonatomic) NSString *templateString;
@property (strong, nonatomic) NSMutableDictionary* tmpPost;

@end

@implementation FSPostDetailViewController

@synthesize postTitle = _postTitle;
@synthesize postLinkURL = _postLinkURL;
@synthesize contentView = _contentView;

@synthesize activities = _activities;
@synthesize attributedStringOptions = _attributedStringOptions;
@synthesize templateEngine = _templateEngine;
@synthesize templateString = _templateString;
@synthesize tmpPost = _tmpPost;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        _contentView = [[UIWebView alloc] init];
        _contentView.delegate = self;
        _activities = @[
                         [[TUSafariActivity alloc] init],
                         [[FSOpenOriginalPostActivity alloc] init],
                         [[WeixinSessionActivity alloc] init],
                         [[WeixinTimelineActivity alloc] init]
                         ];

        NSString *path = [[NSBundle mainBundle] pathForResource:@"post" ofType:@"html"];
        _templateString = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
        _templateEngine = [[CCTemplate alloc] init];
        
        self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemReply target:self action:@selector(rightBarButtonItem_onclick)];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    if (_tmpPost != nil)
    {
        [self renderPost:_tmpPost];
        _tmpPost = nil;
    }
    [_contentView setFrame:CGRectMake(0, 0, self.navigationController.navigationBar.frame.size.width, self.navigationController.view.frame.size.height)];
    [self.view addSubview:_contentView];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    if ([self isMovingFromParentViewController])
    {
        [_contentView loadHTMLString:@"" baseURL:nil];
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    [_contentView loadHTMLString:@"" baseURL:nil];
}


- (void)renderPost:(NSMutableDictionary *)post
{
    if (!self.isViewLoaded)
    {
        _tmpPost = post;
        return;
    }
    
    self.title = @"详情";
    
    _postTitle = post[@"title"];
    _postLinkURL = [NSURL URLWithString:post[@"linkUrl"]];
    _postImage = nil;
    
    if (post[@"publishTimeSmart"] == nil)
    {
        NSString *dateString = post[@"publishTime"];
        NSDateFormatter *rfc3339TimestampFormatterWithTimeZone = [[NSDateFormatter alloc] init];
        [rfc3339TimestampFormatterWithTimeZone setLocale:[[NSLocale alloc] initWithLocaleIdentifier:@"en_US_POSIX"]];
        [rfc3339TimestampFormatterWithTimeZone setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.000Z"];
        NSDate *date = [rfc3339TimestampFormatterWithTimeZone dateFromString:dateString];
        dateString = [MXDateUtil formatDateFuzzy:date];
        post[@"publishTimeSmart"] = dateString;
    }
    if (post[@"channelTitle"] == nil)
    {
        NSString *channelId = post[@"channelId"];
        post[@"channelTitle"] = [[FSChannelAgent sharedInstance] channelWithId:channelId][@"title"] ;
    }
    
    NSString *html = [_templateEngine scan:_templateString dict:post];
    [_contentView loadHTMLString:html baseURL:[[NSBundle mainBundle] URLForResource:@"post" withExtension:@"html"]];
}


- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    //NSLog(@"%d | %@ | %@", navigationType, request.URL.scheme, request.URL);
    if (navigationType == UIWebViewNavigationTypeOther || [request.URL.scheme isEqualToString:@"about"] || [request.URL.scheme isEqualToString:@"file"])
    {
        return YES;
    }
    else if (navigationType == UIWebViewNavigationTypeLinkClicked && ([request.URL.scheme isEqualToString:@"http"] || [request.URL.scheme isEqualToString:@"https"]))
    {
        FSWebViewController *webViewController = [FSWebViewController sharedInstance];
        [[FSApplication sharedInstance].navigationController pushViewController:webViewController animated:YES];
        [webViewController navigateToURL:request.URL];
        return NO;
    }
    return NO;
}

- (void)webViewDidStartLoad:(UIWebView *)webView
{

}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{

}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{

}




- (void)rightBarButtonItem_onclick
{
    NSArray *items = nil;
    if (_postImage == nil)
    {
        items = @[ _postTitle, _postLinkURL ];
    }
    else
    {
        items = @[ _postTitle, _postImage, _postLinkURL ];
    }
    
    UIActivityViewController *activityViewController = [[UIActivityViewController alloc] initWithActivityItems:items applicationActivities:_activities];
    [activityViewController setValue:[NSString stringWithFormat:@"推荐: %@", _postTitle] forKey:@"subject"];
    activityViewController.excludedActivityTypes = @[ UIActivityTypeAirDrop, UIActivityTypeAssignToContact, UIActivityTypePostToFlickr, UIActivityTypePrint, UIActivityTypeSaveToCameraRoll ];
    [self presentViewController:activityViewController animated:YES completion:nil];
}

@end
