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
        return delta <= 1 ? localize(@"a second ago") : [NSString stringWithFormat:localize(@"%d seconds ago"), (int)delta];
    }
    if (delta < 2 * MINUTE)
    {
        return localize(@"a minute ago");
    }
    if (delta < 45 * MINUTE)
    {
        int minutes = floor((double)delta/MINUTE);
        return [NSString stringWithFormat:localize(@"%d minutes ago"), minutes];
    }
    if (delta < 90 * MINUTE)
    {
        return localize(@"an hour ago");
    }
    if (delta < 24 * HOUR)
    {
        int hours = floor((double)delta/HOUR);
        return [NSString stringWithFormat:localize(@"%d hours ago"), hours];
    }
    if (delta < 48 * HOUR)
    {
        return localize(@"yesterday");
    }
    if (delta < 30 * DAY)
    {
        int days = floor((double)delta/DAY);
        return [NSString stringWithFormat:localize(@"%d days ago"), days];
    }
    if (delta < 12 * MONTH)
    {
        int months = floor((double)delta/MONTH);
        return months <= 1 ? localize(@"one month ago") : [NSString stringWithFormat:localize(@"%d months ago"), months];
    }
    else
    {
        int years = floor((double)delta/MONTH/12.0);
        return years <= 1 ? localize(@"one year ago") : [NSString stringWithFormat:localize(@"%d years ago"), years];
    }
}

@end
