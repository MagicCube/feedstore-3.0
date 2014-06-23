//
//  FSPostListViewCell.h
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FSPostListViewCell : UITableViewCell

@property (strong, nonatomic) UILabel *titleLabel;

- (void)renderPost:(NSDictionary *)post;
- (NSString *)flattenHTML:(NSString *)html;

@end
