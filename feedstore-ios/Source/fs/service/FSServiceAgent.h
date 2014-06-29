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

- (NSString *)servicePathUnder:(NSString *)subpath;

@end
