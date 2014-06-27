//
//  FSPostDetailViewController.m
//  FeedStore
//
//  Created by Henry on 14-6-23.
//  Copyright (c) 2014年 MagicCube. All rights reserved.
//

#import "FSPostDetailViewController.h"
#import "TUSafariActivity.h"
#import "UIImageView+AFNetworking.h"
#import "DTCoreText.h"
#import "FSWebViewController.h"


@interface FSPostDetailViewController ()

@property (strong, nonatomic) NSDictionary* attributedStringOptions;
@property (strong, nonatomic) NSMutableDictionary* tmpPost;

@end

@implementation FSPostDetailViewController

@synthesize linkURL = _linkURL;
@synthesize contentView = _contentView;
@synthesize scrollView = _scrollView;
@synthesize webViewController = _webViewController;
@synthesize attributedStringOptions = _attributedStringOptions;
@synthesize tmpPost = _tmpPost;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        _contentView = [[DTAttributedTextView alloc] init];
        _scrollView = [[UIScrollView alloc] init];
        
        self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemReply target:self action:@selector(rightBarButtonItem_onclick)];
    }
    return self;
}

- (void)loadView
{
    [super loadView];
    
    _contentView.shouldDrawImages = YES;
    _contentView.scrollEnabled = NO;
    _contentView.bounces = NO;
    _contentView.alwaysBounceVertical = NO;
    _contentView.alwaysBounceHorizontal = NO;
    _contentView.showsVerticalScrollIndicator = NO;
    _contentView.showsHorizontalScrollIndicator = NO;
    _contentView.contentInset = UIEdgeInsetsMake(15, 15, 15, 15);
    _contentView.textDelegate = self;
    
    _scrollView.scrollEnabled = YES;
    _scrollView.alwaysBounceVertical = YES;
    _scrollView.showsVerticalScrollIndicator = YES;
    
    _attributedStringOptions = @{
                                 DTDefaultFontFamily: @"Helvetica",
                                 DTDefaultLineHeightMultiplier: @1.5,
                                 DTDefaultFontSize: @17,
                                 DTDefaultLinkColor: [UIColor blueColor],
                                 DTMaxImageSize: [NSValue valueWithCGSize:CGSizeMake([UIScreen mainScreen].bounds.size.width - _contentView.contentInset.left - _contentView.contentInset.right, 1080)]
                                 
                                 };
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    _scrollView.frame = self.view.frame;
    [self.view addSubview:_scrollView];
    
    [_scrollView addSubview:_contentView];
    
    if (_tmpPost != nil)
    {
        [self renderPost:_tmpPost];
        _tmpPost = nil;
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}


- (void)renderPost:(NSMutableDictionary *)post
{
    if (!self.isViewLoaded)
    {
        _tmpPost = post;
        return;
    }
    
    self.title = @"详情";
    
    _linkURL = [NSURL URLWithString:post[@"linkUrl"]];
    
    NSString *dateString = post[@"publishTime"];
    NSDateFormatter *rfc3339TimestampFormatterWithTimeZone = [[NSDateFormatter alloc] init];
    [rfc3339TimestampFormatterWithTimeZone setLocale:[[NSLocale alloc] initWithLocaleIdentifier:@"en_US_POSIX"]];
    [rfc3339TimestampFormatterWithTimeZone setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.000Z"];
    NSDate *date = [rfc3339TimestampFormatterWithTimeZone dateFromString:dateString];
    dateString = [MXDateUtil formatDateFuzzy:date];
    
    NSString *html = [NSString stringWithFormat:@"<h3 style='color: #002d9b'>%@</h3>\n<div style='color: #888888; font-size: 14px;margin-bottom: 15px'>发表于 %@</div>\n<div>%@</div>", post[@"title"], dateString, post[@"content"]];
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
    
    CGFloat height = sizeNeeded.height + _contentView.contentInset.top + _contentView.contentInset.bottom;
    if (height < self.scrollView.frame.size.height - _contentView.contentInset.top * 2 - _contentView.contentInset.bottom * 2)
    {
        height = self.scrollView.frame.size.height - _contentView.contentInset.top * 2 - _contentView.contentInset.bottom * 2;
    }
    _contentView.frame = CGRectMake(0,
                                    0,
                                    self.navigationController.navigationBar.frame.size.width,
                                    height);
    _scrollView.contentSize = _contentView.frame.size;
    [self.scrollView setContentOffset:CGPointZero animated:NO];
}







- (UIView *)attributedTextContentView:(DTAttributedTextContentView *)attributedTextContentView viewForAttachment:(DTTextAttachment *)attachment frame:(CGRect)frame
{
	if ([attachment isKindOfClass:[DTImageTextAttachment class]])
	{
        if (frame.size.width == 0 && frame.size.height)
        {
            CGFloat width = [UIScreen mainScreen].bounds.size.width - _contentView.contentInset.left - _contentView.contentInset.right;
            frame = CGRectMake(frame.origin.x, frame.origin.y, width, width / 4 * 3);
        }
		UIImageView *imageView = [[UIImageView alloc] initWithFrame:frame];
        imageView.backgroundColor = rgbhex(0xdddddd);
        NSURLRequest *requst = [NSURLRequest requestWithURL:attachment.contentURL];
        [imageView setImageWithURLRequest:requst placeholderImage:nil success:^(NSURLRequest *request, NSHTTPURLResponse *response, UIImage *image) {
            imageView.image = image;
            attachment.originalSize = image.size;
            imageView.backgroundColor = [UIColor clearColor];
            
            [_contentView relayoutText];
            CGFloat height = _contentView.contentSize.height + _contentView.contentInset.top + _contentView.contentInset.bottom;
            _contentView.frame = CGRectMake(0, 0, self.navigationController.navigationBar.frame.size.width, height);
            _scrollView.contentSize = _contentView.frame.size;
        } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
            
        }];
		return imageView;
	}
	return nil;
}




- (void)rightBarButtonItem_onclick
{
    NSArray *items = @[ _linkURL ];
    TUSafariActivity *safariActivity = [[TUSafariActivity alloc] init];
    UIActivityViewController *activityViewController = [[UIActivityViewController alloc] initWithActivityItems:items applicationActivities:@[ safariActivity ]];
    [activityViewController setValue:@"This is a Subject" forKey:@"subject"];
    [self presentViewController:activityViewController animated:YES completion:nil];
}

@end
