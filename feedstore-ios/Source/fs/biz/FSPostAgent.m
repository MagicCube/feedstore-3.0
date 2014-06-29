//
//  FSPostAgent.m
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostAgent.h"
#import "FSChannelAgent.h"
#import "AFNetworking.h"

@implementation FSPostAgent

+ (FSPostAgent *)sharedInstance
{
    static id sharedInstance = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    
    return sharedInstance;
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
                                             if (responseObject[@"channels"] != nil)
                                             {
                                                 [[FSChannelAgent sharedInstance] resetChannels:responseObject[@"channels"]];
                                             }
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
