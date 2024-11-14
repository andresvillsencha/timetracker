<?php
    // parse_str(file_get_contents("php://input"),$putData);

    $where="";
    include_once '_dateFilter.php';

    $sql="
        SELECT 
            qAll.*,
            IF(remaining_time<=0,1,0) AS deadline_met,
            IF(remaining_time>0 AND remaining_time<=3,1,0) AS less_than_three_days,
            IF(remaining_time>3 AND remaining_time<=7,1,0) AS less_than_a_week,
            IF(remaining_time>7,1,0) AS ok,
            remaining_time,
            CONCAT(users.first_name,' ',users.last_name) as full_name

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
        INNER JOIN users ON qAll.assigned_to=users.user_id
            ORDER BY remaining_time
            LIMIT 10



    ";

    include_once '_genData.php';

    
?>