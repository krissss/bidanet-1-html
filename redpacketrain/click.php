<?php
sleep(0);
if(isset($_POST['click'])){
    echo json_encode(array(
        'code' => 1,
        'msg' => '恭喜您获得'.rand(1,50).'元红包'
    ));
    // echo json_encode(array(
    //     'code' => 0,
    //     'msg' => '很遗憾，你没获得红包'
    // ));
    // echo json_encode(array(
    //     'code' => -1,
    //     'msg' => '红包已经被抢完'
    // ));
    // echo json_encode(array(
    //     'code' => -2,
    //     'msg' => '接口请求错误'
    // ));
}else{
    echo json_encode(array(
        'code' => -99,
        'msg' => '非法请求'
    ));
}