//
//  FSPostListViewSimpleCell.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostListViewSimpleCell.h"

@implementation FSPostListViewSimpleCell

@synthesize contentLabel = _contentLabel;

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self)
    {
        _contentLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 26, self.frame.size.width - 20, 68)];
        _contentLabel.textColor = rgbhex(0x252d4b);
        _contentLabel.font = [UIFont systemFontOfSize:13];
        _contentLabel.numberOfLines = 0;
        _contentLabel.lineBreakMode = NSLineBreakByClipping;
        
        [self addSubview:_contentLabel];
    }
    return self;
}

- (void)renderPost:(NSDictionary *)post
{
    [super renderPost:post];
    
    NSInteger maxLength = 75;
    NSString *text = [self flattenHTML:post[@"content"]];
    if (text.length > maxLength)
    {
        text = [text substringToIndex:maxLength];
        text = [NSString stringWithFormat:@"%@...", text];
    }
    _contentLabel.text = text;
    
    if (_contentLabel.text > 0)
    {
        NSMutableParagraphStyle *style = [NSMutableParagraphStyle new];
        style.lineSpacing = 4;
        NSMutableAttributedString *attrString = [[NSMutableAttributedString alloc] initWithString:text];
        [attrString addAttribute:NSParagraphStyleAttributeName value:style range:NSMakeRange(0, text.length)];
        _contentLabel.attributedText = attrString;
    }
}

@end
