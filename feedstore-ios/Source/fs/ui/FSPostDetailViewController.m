//
//  FSPostDetailViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostDetailViewController.h"
#import "UIImageView+AFNetworking.h"
#import "DTCoreText.h"


@interface FSPostDetailViewController ()

@property (strong, nonatomic) NSDictionary* attributedStringOptions;

@end

@implementation FSPostDetailViewController

@synthesize contentView = _contentView;
@synthesize scrollView = _scrollView;
@synthesize attributedStringOptions = _attributedStringOptions;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        _contentView = [[DTAttributedTextView alloc] init];
        _contentView.shouldDrawImages = YES;
        _contentView.scrollEnabled = NO;
        _contentView.bounces = NO;
        _contentView.alwaysBounceVertical = NO;
        _contentView.alwaysBounceHorizontal = NO;
        _contentView.showsVerticalScrollIndicator = NO;
        _contentView.showsHorizontalScrollIndicator = NO;
        _contentView.contentInset = UIEdgeInsetsMake(10, 10, 10, 10);
        _contentView.textDelegate = self;
        
        _scrollView = [[UIScrollView alloc] init];
        _scrollView.scrollEnabled = YES;
        _scrollView.alwaysBounceVertical = YES;
        _scrollView.showsVerticalScrollIndicator = YES;
        
        _attributedStringOptions = @{
                                     DTDefaultFontFamily: @"Helvetica",
                                     DTDefaultLineHeightMultiplier: @1.5,
                                     DTDefaultFontSize: @16,
                                     DTDefaultLinkColor: [UIColor blueColor],
                                     DTMaxImageSize: [NSValue valueWithCGSize:CGSizeMake(290, 1080)]
                                     };
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    _scrollView.frame = self.view.frame;
    [self.view addSubview:_scrollView];
    
    [_scrollView addSubview:_contentView];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}


- (void)renderPost:(NSMutableDictionary *)post
{
    self.title = @"详情";
    
    NSString *html = post[@"content"];
    NSData *data = [html dataUsingEncoding:NSUTF8StringEncoding];
    
    NSAttributedString *attrString = [[NSAttributedString alloc] initWithHTMLData:data options:_attributedStringOptions documentAttributes:NULL];
    _contentView.attributedString = attrString;
    
    DTCoreTextLayouter *layouter = [[DTCoreTextLayouter alloc] initWithAttributedString:attrString];
    CGRect maxRect = CGRectMake(0,
                                0,
                                self.navigationController.navigationBar.frame.size.width - _contentView.contentInset.left - _contentView.contentInset.right,
                                CGFLOAT_HEIGHT_UNKNOWN);
    DTCoreTextLayoutFrame *layoutFrame = [layouter layoutFrameWithRect:maxRect range:NSMakeRange(0, [attrString length])];
    CGSize sizeNeeded = [layoutFrame frame].size;
    
    _contentView.frame = CGRectMake(0,
                                    0,
                                    self.navigationController.navigationBar.frame.size.width,
                                    sizeNeeded.height + _contentView.contentInset.top + _contentView.contentInset.bottom);
    _scrollView.contentSize = _contentView.frame.size;
    [self.scrollView setContentOffset:CGPointZero animated:NO];
}







- (UIView *)attributedTextContentView:(DTAttributedTextContentView *)attributedTextContentView viewForAttachment:(DTTextAttachment *)attachment frame:(CGRect)frame
{
	if ([attachment isKindOfClass:[DTImageTextAttachment class]])
	{
		UIImageView *imageView = [[UIImageView alloc] initWithFrame:frame];
        imageView.backgroundColor = rgbhex(0xdddddd);
        NSURLRequest *requst = [NSURLRequest requestWithURL:attachment.contentURL];
        [imageView setImageWithURLRequest:requst placeholderImage:nil success:^(NSURLRequest *request, NSHTTPURLResponse *response, UIImage *image) {
            imageView.image = image;
            attachment.originalSize = image.size;
            
            [_contentView relayoutText];
            _contentView.frame = CGRectMake(0, 0, _contentView.contentSize.width, _contentView.contentSize.height + _contentView.contentInset.top * 2 + _contentView.contentInset.bottom * 2);
            _scrollView.contentSize = _contentView.frame.size;
        } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
            
        }];
		return imageView;
	}
	return nil;
}

@end
