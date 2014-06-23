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

+ (FSServiceAgent *)sharedInstance;

@end
