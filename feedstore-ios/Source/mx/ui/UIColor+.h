//
//  UIColor+.h
//  FeedStore
//
//  Created by Henry Li on 13-5-11.
//  Copyright (c) 2013年 MagicCube. All rights reserved.
//

#ifndef mx_ui_UIColor
    #define mx_ui_UIColor

    #define rgb(r, g, b) \
        [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:1]

    #define rgba(r, g, b, a) \
        [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:(a)]

    #define rgbhex(rgbValue) \
        [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 \
        green:((float)((rgbValue & 0xFF00) >> 8))/255.0 \
        blue:((float)(rgbValue & 0xFF))/255.0 \
        alpha:1.0]
#endif
