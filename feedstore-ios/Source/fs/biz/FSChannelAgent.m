//
//  FSChannelAgent.m
//  FeedStore
//
//  Created by Henry on 14-6-29.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSChannelAgent.h"

@interface FSChannelAgent()

@property (strong, nonatomic, readonly) NSMutableDictionary *channelSet;

@end

@implementation FSChannelAgent

@synthesize channels = _channels;
@synthesize channelSet = _channelSet;

- (instancetype)init
{
    self = [super init];
    if (self) {
        _channels = [[NSMutableArray alloc] init];
        _channelSet = [[NSMutableDictionary alloc] init];
    }
    return self;
}

+ (FSChannelAgent *)sharedInstance
{
    static id sharedInstance = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    
    return sharedInstance;
}

- (NSMutableDictionary *)channelWithId:(NSString *)cid
{
    return (NSMutableDictionary *)(_channelSet[cid]);
}

- (void)addChannel:(NSMutableDictionary *)channel
{
    [_channels addObject:channel];
    _channelSet[channel[@"_id"]] = channel;
}

- (void)addChannels:(NSArray *)channels
{
    for (NSMutableDictionary *channel in channels)
    {
        [self addChannel:channel];
    }
}

- (void)removeAllChannels
{
    [_channels removeAllObjects];
    [_channelSet removeAllObjects];
}

- (void)resetChannels:(NSArray *)channels
{
    [self removeAllChannels];
    [self addChannels:channels];
}

@end
