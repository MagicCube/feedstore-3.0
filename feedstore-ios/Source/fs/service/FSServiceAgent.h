//
//  FSServiceAgent.h
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <Foundation/Foundation.h>

@class FSServiceAgent;

@interface FSServiceAgent : NSObject

@property (copy, nonatomic, readonly) NSString *rootServicePath;

+ (FSServiceAgent *)sharedInstance;

- (NSString *)servicePathUnder:(NSString *)subpath;
- (id)queryPostsAtPage:(NSInteger)pageIndex
          withPageSize:(NSInteger)pageSize
              callback:(void (^)(NSError *error, id posts))callback;

@end
