//
//  FSChannelAgent.h
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface FSChannelAgent : NSObject

@property (strong, nonatomic, readonly) NSMutableArray *channels;

+ (FSChannelAgent *)sharedInstance;
- (NSMutableDictionary *)channelWithId:(NSString *)cid;
- (void)addChannel:(NSMutableDictionary *)channel;
- (void)addChannels:(NSArray *)channels;
- (void)resetChannels:(NSArray *)channels;
- (void)removeAllChannels;

@end
