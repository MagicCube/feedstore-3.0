//
//  FSConfiguration.m
//  FeedStore
//
//  Created by Henry Li on 13-5-12.
//  Copyright (c) 2013年 MagicCube. All rights reserved.
//

#import "FSConfig.h"

@implementation FSConfig

+ (NSDictionary *)settings
{
    static NSDictionary *_settings = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        NSString *path = [[NSBundle mainBundle] pathForResource:@"FeedStore-Config" ofType:@"plist"];
        _settings = [NSDictionary dictionaryWithContentsOfFile:path];
    });
    
    return _settings;
}


+ (NSString *)settingWithKey:(NSString *)key defaultValue:(NSString *)defaultValue
{
    id value = [FSConfig settings][key];
    if (value == nil)
    {
        return defaultValue;
    }
    return value;
}

+ (NSString *)settingWithKey:(NSString *)key
{
    return [FSConfig settingWithKey:key defaultValue:nil];
}

@end
