<?php
    // parse_str(file_get_contents("php://input"),$putData);

    $where="";
    include_once '_dateFilter.php';

    $sql="
        SELECT 
            SUM(IF(remaining_time<=0,1,0)) AS deadline_met,
            SUM(IF(remaining_time>0 AND remaining_time<=3,1,0)) AS less_than_three_days,
            SUM(IF(remaining_time>3 AND remaining_time<=7,1,0)) AS less_than_a_week,
            SUM(IF(remaining_time>7,1,0)) AS all_tasks

        FROM 

        (
            SELECT
                tasks.*,
                activities.activity,
                TIMEDIFF(deadline_date,NOW())/3600/24 AS remaining_time
            FROM tasks
            INNER JOIN activities ON tasks.activity_id=activities.activity_id
            WHERE tasks.active=1 AND tasks.status_id <5 AND productive=1 $where
        )qAll

    ";

    include_once '_genData.php';

    
?>