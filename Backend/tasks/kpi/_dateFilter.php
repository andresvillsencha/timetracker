<?php 


    $startDate = $_GET['startDate'] ?? date('Y-m-d');
    $endDate   = $_GET['endDate'] ?? date('Y-m-t');

    $where = "";
    if ($startDate!==null) {
        $newDate = date ('Y-m-d', strtotime($startDate));
        $where=" AND DATE(deadline_date)>='{$newDate}'";
    }
    if ($endDate!==null) {
        $newDate = date ('Y-m-d', strtotime($endDate));
        $where="  AND DATE(deadline_date) <= '{$newDate}'";
    }

?>