$(function(){
    var speed = 500, // 每隔N秒发一个红包
        minAnamiteSpeed = 5000, // 红包最小动画速度
        maxAnamiteSpeed = 10000, // 红包最大动画速度
        animateEasing = 'linear', // 红包动画效果     
        windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        ajaxSwitchUrl = $('input[name="ajax-switch-url"]').val(), // 红包雨开关的地址
        ajaxClickUrl = $('input[name="ajax-click-url"]').val(), // 红包雨点击后请求的地址
        clickPicTransformTime = 1000, // 点击的红包动态图延迟的时间
        ajaxTimeOut = 4000, // 点击请求超时时间
        isSwitchOn = false, // 红包雨开关标记
        immediately = true, // 如果刷新页面的时候红包开关已经开启则不显示倒计时
        body = $('body'),
        sendPacketInterval;
    
    // 开启发红包
    // sendPacketInterval = setInterval(setOnePacket, speed);
    
    // setTimeout(function(){
    //     关闭发红包
    //     clearInterval(sendPacketInterval);
    // }, 10000);

    // 动态请求后台的开关
    setInterval(function(){
        $.ajax({
            type: 'GET',
            url: ajaxSwitchUrl,
            success: function(data){
                if(data == 'on'){
                    if(!isSwitchOn){
                        isSwitchOn = true;                        
                        if(immediately){
                            $('.rain-text').empty();
                            // 开启发红包
                            sendPacketInterval = setInterval(setOnePacket, speed);
                        }else{
                            var startCount = 4; // 倒计时，比显示的数字+1
                            var countDown = setInterval(function(){
                                if(startCount == 4){
                                    $('.rain-text').addClass('number').text('即将开始');
                                }else{
                                    $('.rain-text').text(startCount);
                                }
                                if(startCount < 0){
                                    clearInterval(countDown);
                                    $('.rain-text').empty();
                                    // 开启发红包
                                    sendPacketInterval = setInterval(setOnePacket, speed);
                                }
                                startCount--;
                            },1000);
                        }
                    }
                } else {
                    immediately = false;
                    if(isSwitchOn){
                        isSwitchOn = false;
                        // 关闭发红包
                        clearInterval(sendPacketInterval);
                        // 定时显示结束文字
                        setTimeout(function(){
                            $('.rain-text').removeClass('number').text('红包雨已结束');
                        },minAnamiteSpeed);
                    }
                }
            }
        });
    }, 1000);

    // 点击红包后的操作
    body.on('click','.rain-used',function(){
        var text = '';
        $(this).remove();
        $('.click-transform').show();
        setTimeout(function(){
            $.ajax({
                type: 'POST',
                url: ajaxClickUrl,
                data: {click:1},
                timeout : ajaxTimeOut,
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    $('.click-result .text').text(data.msg);
                    $('.click-transform').hide();
                    $('.click-result').not('.click-transform').show();
                },
                complete : function(XMLHttpRequest,status){
            　　　　if(status=='timeout'){
                        text = '请求超时，请稍后再试';
                        $('.click-result .text').text(text);
                        $('.click-transform').hide();
                        $('.click-result').not('.click-transform').show();
            　　　　}
            　　}
            });
        }, clickPicTransformTime);
    });

    body.on('click','.click-result .remove',function(){
        $('.click-result').hide();
    });

    // 发出一个红包
    function setOnePacket(){
        var randLeft = getRandNumber(0,windowWidth-50),
            randSpeend = getRandNumber(minAnamiteSpeed,maxAnamiteSpeed),
            randPactet = getRandNumber(1,4);
            elem = $('.rain.p'+randPactet).clone();
        body.append(elem);
        elem.removeClass('rain').addClass('rain-used').css({'left':randLeft})
        .animate({'top':windowHeight+300},randSpeend,animateEasing,function(){
            $(this).remove();
        });
    }

    // 获取 min，max 之间的一个随机值
    function getRandNumber(min, max){
        var range = max - min;
        var rand = Math.random();
        return(min + Math.round(rand * range));
    }
});