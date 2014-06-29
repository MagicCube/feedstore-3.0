//
//  FSFSPostListViewSinglePhotoCell.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSListViewTextPhotoCell.h"
#import "UIImageView+AFNetworking.h"

@interface FSListViewTextPhotoCell()

@end

@implementation FSListViewTextPhotoCell

@synthesize photoView = _photoView;

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self)
    {
        CGFloat photoWidth = 68;
        _photoView = [[UIImageView alloc] initWithFrame:CGRectMake(10, 46, photoWidth, photoWidth / 4 * 3)];
        _photoView.backgroundColor = rgbhex(0xdddddd);
        [self addSubview:_photoView];
        
        self.contentLabel.frame = CGRectMake(10 + photoWidth + 10, 37, self.frame.size.width - 20 - _photoView.frame.size.width - 10, photoWidth);
    }
    return self;
}

- (void)renderPost:(NSMutableDictionary *)post
{
    [super renderPost:post];
    
    _photoView.image = nil;
    
    NSURL *url = [NSURL URLWithString:post[@"image"][@"url"]];
    [_photoView setImageWithURL:url];
}

@end
