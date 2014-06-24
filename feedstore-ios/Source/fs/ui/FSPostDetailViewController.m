//
//  FSPostDetailViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostDetailViewController.h"
#import "DTCoreText.h"


@interface FSPostDetailViewController ()

@property (strong, nonatomic) NSDictionary* attributedStringOptions;

@end

@implementation FSPostDetailViewController

@synthesize contentLabel = _contentLabel;
@synthesize scrollView = _scrollView;
@synthesize attributedStringOptions = _attributedStringOptions;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        self.title = @"详情";

        _attributedStringOptions = @{
                                     DTDefaultFontFamily: @"Helvetica",
                                     DTDefaultLineHeightMultiplier: @1.5,
                                     DTDefaultFontSize: @17,
                                     DTDefaultLinkColor: [UIColor blueColor]
                                     };
        _contentLabel = [[DTAttributedLabel alloc] init];
        _scrollView = [[UIScrollView alloc] init];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    _scrollView.frame = self.view.frame;
    _scrollView.scrollEnabled = YES;
    _scrollView.alwaysBounceVertical = YES;
    _scrollView.showsVerticalScrollIndicator = YES;
    [self.view addSubview:_scrollView];
    
    _contentLabel.shouldDrawImages = YES;
    _contentLabel.edgeInsets = UIEdgeInsetsMake(15, 15, 15, 15);
    [_scrollView addSubview:_contentLabel];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}


- (void)renderPost:(NSMutableDictionary *)post
{
    NSString *html = post[@"content"];
    NSData *data = [html dataUsingEncoding:NSUTF8StringEncoding];
    
    NSAttributedString *attrString = [[NSAttributedString alloc] initWithHTMLData:data options:_attributedStringOptions documentAttributes:NULL];
    _contentLabel.attributedString = attrString;
    
    DTCoreTextLayouter *layouter = [[DTCoreTextLayouter alloc] initWithAttributedString:attrString];
    CGRect maxRect = CGRectMake(0,
                                0,
                                self.navigationController.navigationBar.frame.size.width - _contentLabel.edgeInsets.left - _contentLabel.edgeInsets.right,
                                CGFLOAT_HEIGHT_UNKNOWN);
    DTCoreTextLayoutFrame *layoutFrame = [layouter layoutFrameWithRect:maxRect range:NSMakeRange(0, [attrString length])];
    CGSize sizeNeeded = [layoutFrame frame].size;
    
    _contentLabel.frame = CGRectMake(
                                     0,
                                     0,
                                     self.navigationController.navigationBar.frame.size.width,
                                     sizeNeeded.height + _contentLabel.edgeInsets.top + _contentLabel.edgeInsets.bottom);
    _scrollView.contentSize = _contentLabel.frame.size;
    [self.scrollView setContentOffset:CGPointZero animated:NO];
}

@end
