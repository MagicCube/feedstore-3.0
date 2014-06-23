//
//  MXDateUtil.h
//  FeedStore
//
//  Created by Henry Li on 13-5-12.
//  Copyright (c) 2013年 MagicCube. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MXDateUtil : NSObject

+ (NSDate *)dateFromNumber:(NSNumber *)number;
+ (NSString *)formatDate:(NSDate *)date withFormatString:(NSString *)formatString;
+ (NSString*)formatDateFuzzy:(NSDate*)date;

@end
