$(function () {
    var table = $('.table'),
        /**
         * 存放最终的数据
         * 类似格式：
         * [
         *      ['投资人1',0,1,2,3,4,5],
         *      ['投资人2',1,1,1,1,1,1],
         *      ['投资人3',2,2,2,2,2,2],
         *      ['投资人4',3,3,3,3,3,3],
         *      ['投资人5',4,4,4,4,4,4],
         *      ['最终得分',2,2,2,2,2,2], // 最终得分后台计算
         * ]
         */
        data = [],
        startTdIndex = 1, // 开始插入的td的下标
        bgColor = 1, // 标题的背景色，1-4
        newElem = '', // 新插入的节点
        ajaxTime = parseInt($('input[name="ajax-time"]').val()) * 1000,
        ajaxUrl = $('input[name="ajax-url"]').val(),
        updateTimeElem = $('.update-time');

    getTableData();
    // 定时 ajax 获取 data,更新 table
    setInterval(function () {
        getTableData();
    }, ajaxTime);

    function getTableData() {
        $.ajax({
            type: 'GET',
            url: ajaxUrl,
            success: function (successData) {
                data = successData;
                updateTable();
                updateTimeElem.text(getCurrentDate());
            },
            dataType: 'json'
        });
    }

    function updateTable() {
        var dataLength = data.length;
        for (var i = 0; i < dataLength; i++) {
            // 单个用户的信息追加
            var innerDataLength = data[i].length;
            for (var j = 0; j < innerDataLength; j++) {
                if (j == 0) { // 第一行的时候需要有背景色
                    // 获取用哪个背景色
                    if (dataLength == i + 1) { // 如果是最后一个最终得分，则为green
                        bgColor = 'green';
                    } else {
                        bgColor = i % 4 + 1;
                    }
                    newElem = '<td class="need-remove bg-' + bgColor + '">' + data[i][j] + '</td>';
                } else { // 非第一行需要设定间隔颜色
                    if (!(i % 2)) {
                        newElem = '<td class="need-remove overlying">' + data[i][j] + '</td>';
                    } else {
                        newElem = '<td class="need-remove">' + data[i][j] + '</td>';
                    }
                }
                var node = table.find('tr').eq(j).find('td');
                // 如果节点存在则替换，否则插入
                if (node.eq(startTdIndex + 1).length) {
                    node.eq(startTdIndex + 1).replaceWith(newElem);
                } else {
                    node.eq(startTdIndex).after(newElem);
                }

            }
            startTdIndex++;
        }
        // 用完重置
        startTdIndex = 1;
    }

    /**
     * 获取当前时间
     */
    function getCurrentDate() {
        return new Date().toLocaleString().replace(/[年月]/g,'-').replace(/[日上下午]/g,'');
    }

});