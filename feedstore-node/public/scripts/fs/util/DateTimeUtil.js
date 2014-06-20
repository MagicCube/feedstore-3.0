$ns("fs.util");

fs.util.DateTimeUtilClass = function()
{
    var me = $extend(MXObject);
    
    me.parseServerTime = function(p_timeString)
    {
        return new Date(p_timeString);
    };
    
    me.getShortString = function(p_date)
    {
        var now = Date.now();
        if (p_date > now - 60 * 1000)
        {
            return "刚刚";
        }
        else if (p_date > now - 60 * 60 * 1000)
        {
            return Math.round((now - p_date) / 1000 / 60) + " 分钟前";
        }
        else if (p_date > now - 24 * 60 * 60 * 1000)
        {
            return Math.round((now - p_date ) / 1000 / 60 / 60) + " 小时前";
        }
        else if (p_date > now - 24 * 60 * 60 * 1000 * 2)
        {
            return "昨天";
        }
        else if (p_date > now - 24 * 60 * 60 * 1000 * 3)
        {
            return "前天";
        }
        else
        {
            return $format(p_date, "M月d日");
        }
    };
    
    return me.endOfClass(arguments);
};
fs.util.DateTimeUtil = new fs.util.DateTimeUtilClass();
fs.util.DateTimeUtilClass.className = "fs.util.DateTimeUtilClass";