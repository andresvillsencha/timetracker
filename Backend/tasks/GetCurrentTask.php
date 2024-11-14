<?php
    include_once '../serverData.php';


    $conn = new mysqli($server, $username, $password, $db );

        $userId=$_GET['userId'] ?? 0;

        $sql="
            SELECT 
                * 
            FROM
            (
            SELECT 
                tasks.*,
                status.status,
                status.color,
                activities.activity,
                activities.productive,
                activities.price,
                activities.icon,
                qAdmin.*,
                IFNULL(qUsers.user_id, 0) as user_id,
                IFNULL(qUsers.user_name, '') as user_name,
                IFNULL(qUsers.email, '') as email,
                IFNULL(qUsers.phone_number, '') as phone_number,
                IFNULL(qTime.elapsed_time,0) AS elapsed_time,
                IFNULL(qTime.elapsed_time,0)/60*activities.price AS invoiced_amount
            FROM tasks 
                INNER JOIN `status` ON tasks.status_id=`status`.status_id
                INNER JOIN activities ON tasks.activity_id=activities.activity_id
                INNER JOIN (SELECT user_id as admin_id, CONCAT(first_name,' ',last_name) AS admin_name FROM users) qAdmin ON tasks.created_by=qAdmin.admin_id
                LEFT JOIN (SELECT user_id, CONCAT(first_name,' ',last_name) AS user_name, email, phone_number FROM users) qUsers ON tasks.assigned_to=qUsers.user_id
                LEFT JOIN (
                    SELECT 
                        SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))/60) as elapsed_time,
                        task_id
                    FROM tasks_tracker
                    WHERE active=1 AND status_id=3
                    GROUP BY task_id
                ) qTime ON tasks.task_id=qTime.task_id
            ) qAll
             WHERE user_id={$userId} AND status_id=3
        ";

        $result=$conn->query($sql);
        $totalRowsResult=$conn->query("SELECT FOUND_ROWS()");
        $totalRows = $totalRowsResult->fetch_array()[0];

        $jsonData="";
        $firstRow=true;
        while ($row = $result->fetch_assoc()) {
            $jsonRow=json_encode($row);
            $jsonData.=(!$firstRow ? ",":"").$jsonRow;
            $firstRow=false;
        }

        echo '{
            "count": '.$totalRows.',
            "success": true,
            "data": ['.$jsonData.']
        }';


    $conn->close();

?>