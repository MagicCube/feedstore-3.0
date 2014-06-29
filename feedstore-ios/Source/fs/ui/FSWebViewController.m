//
//  FSWebViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-24.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSWebViewController.h"

@interface FSWebViewController ()

@end

@implementation FSWebViewController

@synthesize webView = _webView;

+ (FSWebViewController*)sharedInstance
{
    static FSWebViewController *sharedInstance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        self.title = @"网页";
        _webView = [[UIWebView alloc] init];
        _activityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite];
    }
    return self;
}

- (void)loadView
{
    _webView.scalesPageToFit = YES;
    _webView.delegate = self;
    
    self.view = _webView;
    CGRect bounds = [[UIScreen mainScreen] bounds];
    self.view.autoresizesSubviews = YES;
    self.view.frame = CGRectMake(0, 0, bounds.size.width, bounds.size.height);
    self.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:_activityIndicatorView];
    _activityIndicatorView.hidesWhenStopped = YES;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    self.title = @"网页";
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    
    [_webView loadHTMLString:@"" baseURL:nil];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    
    [_webView loadHTMLString:@"" baseURL:nil];
}



- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    return YES;
}

- (void)webViewDidStartLoad:(UIWebView *)webView
{
    [_activityIndicatorView startAnimating];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    [_activityIndicatorView stopAnimating];
    self.title = [_webView stringByEvaluatingJavaScriptFromString:@"document.title"];
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{
    
}




- (void)navigateToURL:(NSURL *)URL
{
    NSURLRequest *request = [NSURLRequest requestWithURL:URL];
    [self.webView loadHTMLString:@"" baseURL:nil];
    
    [self.webView loadRequest:request];
}


@end
