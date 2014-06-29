//
//  FSPostListViewCell.h
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FSListViewCell : UITableViewCell

@property (strong, nonatomic) UILabel *titleLabel;

- (void)renderPost:(NSMutableDictionary *)post;

@end
