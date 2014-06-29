//
//  FSServiceAgent.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSServiceAgent.h"
#import "AFNetworking.h"

@interface FSServiceAgent()

@end

@implementation FSServiceAgent

+ (FSServiceAgent *)sharedInstance
{
    static id sharedInstance = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    
    return sharedInstance;
}

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

- (void)queryPostsAtPage:(NSInteger)pageIndex
          withPageSize:(NSInteger)pageSize
              callback:(void (^)(NSError *error, id posts))callback
{
    NSLog(@"Querying post...");
    NSMutableDictionary *params = [NSMutableDictionary dictionaryWithDictionary:@{
        @"pageIndex": [NSNumber numberWithLong: pageIndex],
        @"pageSize": [NSNumber numberWithLong: pageSize]
    }];
    if (pageIndex == 0)
    {
        params[@"selectChannels"] = @"true";
    }
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    AFHTTPRequestOperation *operation = [manager GET:[self servicePathUnder:@"posts"]
      parameters: params
     
    success:^(AFHTTPRequestOperation *operation, id responseObject)
    {
        NSLog(@"DONE");
        if (callback != nil)
        {
            callback(nil, responseObject);
        }
    }
     
    failure:^(AFHTTPRequestOperation *operation, NSError *error)
    {
        NSLog(@"FAIL");
        if (callback != nil)
        {
            callback(error, nil);
        }
    }];
    
    operation.responseSerializer = [AFJSONResponseSerializer serializerWithReadingOptions: NSJSONReadingMutableContainers];
}

@end
