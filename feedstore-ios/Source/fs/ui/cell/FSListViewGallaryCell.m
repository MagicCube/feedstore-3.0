//
//  FSPostListViewGallaryCell.m
//  FeedStore
//
//  Created by Henry on 14-6-24.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSListViewGallaryCell.h"
#import "UIImageView+AFNetworking.h"

@implementation FSListViewGallaryCell

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
            CGRect frame = CGRectMake(10 + i * (photoWidth + 10), 46, photoWidth, photoWidth / 4 * 3);
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
