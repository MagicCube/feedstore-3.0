//
//  MXDateUtil.m
//  FeedStore
//
//  Created by Henry Li on 13-5-12.
//  Copyright (c) 2013年 MagicCube. All rights reserved.
//

#import "MXDateUtil.h"

#define SECOND 1
#define MINUTE (60 * SECOND)
#define HOUR (60 * MINUTE)
#define DAY (24 * HOUR)
#define MONTH (30 * DAY)

@implementation MXDateUtil


+ (NSDate *)dateFromNumber:(NSNumber *)number
{
    long long time = [number longLongValue];
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:time / 1000];
    return date;
}



+ (NSString *)formatDate:(NSDate *)date withFormatString:(NSString *)formatString
{
    if (date == nil)
    {
        return @"";
    }
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    formatter.dateFormat = formatString;
    return [formatter stringFromDate:date];
}

+ (NSString*)formatDateFuzzy:(NSDate*)date
{
    NSDate *now = [[NSDate alloc] init];
    NSTimeInterval delta = [now timeIntervalSinceDate:date];
    
    if (delta < 1 * MINUTE)
    {
        return @"刚刚";
    }
    if (delta < 2 * MINUTE)
    {
        return @"一分钟前";
    }
    if (delta < 60 * MINUTE)
    {
        int minutes = floor((double)delta/MINUTE);
        return [NSString stringWithFormat:@"%d 分钟前", minutes];
    }
    if (delta < 24 * HOUR)
    {
        int hours = floor((double)delta/HOUR);
        return [NSString stringWithFormat:@"%d 小时前", hours];
    }
    if (delta < 48 * HOUR)
    {
        return @"昨天";
    }
    else
    {
        return [MXDateUtil formatDate:date withFormatString:@"yyyy年M月d日"];
    }
}

@end
