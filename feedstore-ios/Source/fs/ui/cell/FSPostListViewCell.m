//
//  FSPostListViewCell.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostListViewCell.h"
#import "NSString+HTML.h"

@implementation FSPostListViewCell

@synthesize titleLabel = _titleLabel;

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self)
    {
        _titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 10, self.frame.size.width - 20, 16)];
        _titleLabel.textColor = rgbhex(0X002d9b);
        _titleLabel.font = [UIFont systemFontOfSize:16];
        [self addSubview:_titleLabel];
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];
}

- (void)renderPost:(NSDictionary *)post
{
    _titleLabel.text = post[@"title"];
}



- (NSString *)flattenHTML:(NSString *)html
{
    NSString *text = [html stringByStrippingTags];
    text = [text stringByDecodingHTMLEntities];
    text = [text stringByRemovingNewLinesAndWhitespace];
    return text;
}

@end
