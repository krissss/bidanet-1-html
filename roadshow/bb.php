<?php
echo json_encode(array(
    'type' => 'error',
    'data' => '您已经提交过，不可重复提交',
));
// echo json_encode(array(
//     'type' => 'success',
//     'data' => '提交成功',
// ));