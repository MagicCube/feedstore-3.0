//
//  FSOriginalPostActivity.m
//  FeedStore
//
//  Created by Henry on 14-6-27.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSOpenOriginalPostActivity.h"
#import "FSWebViewController.h"

@implementation FSOpenOriginalPostActivity

@synthesize originalPostURL = _originalPostURL;
@synthesize webViewController = _webViewController;

- (NSString *)activityTitle
{
    return @"打开来源";
}

- (NSString *)activityType
{
    return NSStringFromClass([self class]);
}

- (BOOL)canPerformWithActivityItems:(NSArray *)activityItems
{
	for (id activityItem in activityItems)
    {
		if ([activityItem isKindOfClass:[NSURL class]])
        {
            return YES;
		}
	}
    return YES;
}

- (void)prepareWithActivityItems:(NSArray *)activityItems
{
	for (id activityItem in activityItems)
    {
		if ([activityItem isKindOfClass:[NSURL class]])
        {
            _originalPostURL = activityItem;
		}
	}
}

- (void)performActivity
{
	BOOL completed = YES;
    if (_webViewController == nil)
    {
        _webViewController = [[FSWebViewController alloc] init];
    }
	[[FSApplication sharedInstance].navigationController pushViewController:_webViewController animated:YES];
    [_webViewController navigateToURL:_originalPostURL];
	[self activityDidFinish:completed];
}

@end
