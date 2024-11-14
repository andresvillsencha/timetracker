<?php
    // parse_str(file_get_contents("php://input"),$putData);

    $where="";
    include_once '_dateFilter.php';

    $sql="
        SELECT 
            CONCAT(users.first_name,' ',users.last_name) as full_name,
            qTimes.*
        FROM
        (SELECT 
            COUNT(task_id) as num_tasks,
            SUM(elapsed_time)/60 AS full_time,
            AVG(elapsed_time)/60 AS avg_time,
            MAX(elapsed_time)/60 AS max_time,
            MIN(elapsed_time)/60 AS min_time,
            SUM(num_events) AS num_events,
            assigned_to AS user_id
        FROM
        (
            SELECT 
                qTaskTime.elapsed_time,
                qTaskTime.num_events,
                tasks.*,
                activities.activity,
                activities.productive
            FROM
            (
                SELECT 
                    SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))/3600) as elapsed_time,
                    COUNT(task_track_id) AS num_events,
                    task_id
                FROM tasks_tracker
                WHERE active=1 AND status_id=3
                GROUP BY task_id
            ) qTaskTime
            INNER JOIN tasks ON qTaskTime.task_id=tasks.task_id
            INNER JOIN activities ON tasks.activity_id=activities.activity_id
            WHERE tasks.active=1 $where
            
        ) qAll
        GROUP BY assigned_to
        )qTimes
        INNER JOIN users ON qTimes.user_id=users.user_id



    ";

    include_once '_genData.php';

    
?>