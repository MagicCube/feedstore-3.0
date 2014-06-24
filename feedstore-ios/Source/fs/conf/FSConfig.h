//
//  FSConfiguration.h
//  FeedStore
//
//  Created by Henry Li on 13-5-12.
//  Copyright (c) 2013年 MagicCube. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface FSConfig : NSObject

+ (NSDictionary *)settings;
+ (id)settingWithKey:(NSString *)key defaultValue:(id)defaultValue;
+ (id)settingWithKey:(NSString *)key;

@end
