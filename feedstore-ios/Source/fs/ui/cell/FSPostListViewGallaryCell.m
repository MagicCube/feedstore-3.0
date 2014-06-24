//
//  FSPostListViewGallaryCell.m
//  FeedStore
//
//  Created by Henry on 14-6-24.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostListViewGallaryCell.h"
#import "UIImageView+AFNetworking.h"

@implementation FSPostListViewGallaryCell

@synthesize photoViews = _photoViews;

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self)
    {
        CGFloat photoWidth = 68;
        _photoViews = [[NSMutableArray alloc] init];
        for (int i =0; i < 4; i++)
        {
            CGRect frame = CGRectMake(10 + i * (photoWidth + 10), 44, photoWidth, photoWidth / 4 * 3);
            UIImageView *imageView = [[UIImageView alloc] initWithFrame:frame];
            imageView.backgroundColor = rgbhex(0xdddddd);
            [self addSubview:imageView];
            [_photoViews addObject:imageView];
        }
    }
    return self;
}

- (void)renderPost:(NSMutableDictionary *)post
{
    [super renderPost:post];
    

    if (post[@"imageUrls"] == nil)
    {
        NSMutableArray *urls = [[NSMutableArray alloc] init];
        NSString *urlString = nil;
        NSScanner *scanner = [NSScanner scannerWithString:post[@"content"]];
        [scanner scanUpToString:@"<img" intoString:nil];
        while (![scanner isAtEnd])
        {
            [scanner scanUpToString:@"src" intoString:nil];
            NSCharacterSet *charset = [NSCharacterSet characterSetWithCharactersInString:@"\"'"];
            [scanner scanUpToCharactersFromSet:charset intoString:nil];
            [scanner scanCharactersFromSet:charset intoString:nil];
            [scanner scanUpToCharactersFromSet:charset intoString:&urlString];
            NSURL *url = [NSURL URLWithString:urlString];
            [urls addObject:url];
            if (urls.count == 4)
            {
                break;
            }
        }
        post[@"imageUrls"] = urls;
    }
    
    NSArray *imageUrls = post[@"imageUrls"];
    for (int i = 0; i < imageUrls.count; i++)
    {
        UIImageView *imageView = _photoViews[i];
        imageView.image = nil;
        NSURL *url = imageUrls[i];
        [imageView setImageWithURL:url];
    }
}

@end
