//
//  FSServiceAgent.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSServiceAgent.h"

@interface FSServiceAgent()

@end

@implementation FSServiceAgent

- (NSString *)rootServicePath
{
    static NSString *rootServicePath = nil;
    if (rootServicePath == nil)
    {
        rootServicePath = [NSString stringWithFormat:@"http://%@/api", [FSConfig settingWithKey:@"fs.service.host"]];
    }
    return rootServicePath;
}

- (NSString *)servicePathUnder:(NSString *)subpath
{
    return [NSString stringWithFormat:@"%@/%@", self.rootServicePath, subpath];
}

@end
