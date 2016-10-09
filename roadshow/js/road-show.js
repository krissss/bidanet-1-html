$(function(){
    var totalScore = 0, // 总分
        submitData = [], // 需要提交的得分数据
        projectId = $('input[name="project-id"]').val(), // 需要提交的项目编号
        submitUrl = $('input[name="submit-url"]').val(); // 提交地址

    // 初始化计算总分
    caculateTotalScore();
    
    // 点击列表显示隐藏分数
    $('.vote-list .item').click(function(){
        var nextElem = $(this).next('.item-click');
        if(nextElem.is(":visible")){
            nextElem.slideUp();
        }else{
            nextElem.slideDown(); 
        }
    });

    // 点击分数记录得分
    $('.item-click a').click(function(){
        // 添加active样式
        $(this).parents('.item-click').eq(0).find('a').removeClass('active');
        $(this).addClass('active');
        // 设定item-click上的得分
        var currentScore = $(this).data('score');
        $(this).parents('.item-click').eq(0).attr('data-score',currentScore);
        // 重新计算总分
        caculateTotalScore();
    });

    // 点击提交
    $('.button-submit').click(function(){
        var showData = '';
        submitData.forEach(function(v){
            var type = v.type;
            if(v.type == 'total'){
                type = '总分';
            }
            showData += type + ':' + v.score + "分\n";
        });
        console.log(showData);
        swal({
            title: '您即将提交的数据',
            text: showData,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认提交',
            cancelButtonText: '不提交',
            closeOnConfirm: false
        }, function(){
            $.ajax({
                type: 'POST',
                url: submitUrl,
                data: {projectId:projectId ,submitData:submitData},
                success: function (successData) {
                    console.log(successData);
                    swal(successData.data,'',successData.type);
                },
                dataType: 'json'
            });
        });
    });

    /**
     * 计算总分
     */
    function caculateTotalScore(){
        var thisScore = 0,
            thisType;
        // 重置数据
        totalScore = 0;
        submitData = [];
        $('.item-click').each(function(){
            thisScore = parseInt($(this).attr('data-score'));
            thisType = $(this).data('type')
            totalScore += thisScore;
            // 添加各个选项的对象
            submitData.push({type:thisType, score:thisScore});
        });
        // 添加总分的对象
        submitData.push({type:"total", score:totalScore});
        $('.total-score').text(totalScore);
    }
});