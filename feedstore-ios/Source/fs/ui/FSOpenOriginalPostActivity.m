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
    FSWebViewController *webViewController = [FSWebViewController sharedInstance];
	[[FSApplication sharedInstance].navigationController pushViewController:webViewController animated:YES];
    [webViewController navigateToURL:_originalPostURL];
	[self activityDidFinish:completed];
}

@end
