//
//  FSPostAgent.h
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSServiceAgent.h"

@interface FSPostAgent : FSServiceAgent

+ (FSPostAgent *)sharedInstance;
- (void)queryPostsWithParameters:(NSDictionary *)parameters
                       pageIndex:(NSInteger)pageIndex
                        pageSize:(NSInteger)pageSize
                        callback:(void (^)(NSError *error, id posts))callback;

@end
