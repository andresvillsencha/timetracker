<?php
    // parse_str(file_get_contents("php://input"),$putData);

    $where="";
    include_once '_dateFilter.php';

    $sql="
        SELECT 
            *,
            full_time*price AS billed_total 
            FROM
            (
                SELECT 
                    COUNT(tasks.task_id) as num_tasks,
                    SUM(elapsed_time)/60 AS full_time,
                    AVG(elapsed_time)/60 AS avg_time,
                    MAX(elapsed_time)/60 AS max_time,
                    MIN(elapsed_time)/60 AS min_time,
                    SUM(num_events) AS num_events,
                    activity_id
                FROM
                (
                    SELECT 
                        SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))/60) as elapsed_time,
                        COUNT(task_track_id) AS num_events,
                        task_id
                    FROM tasks_tracker
                    WHERE active=1 AND status_id=3
                    GROUP BY task_id
                ) qTaskTime
                INNER JOIN tasks ON qTaskTime.task_id=tasks.task_id
                WHERE tasks.active=1  {$where}
                GROUP BY tasks.activity_id
            ) qAll
            INNER JOIN activities ON qAll.activity_id=activities.activity_id
    ";

    include_once '_genData.php';

    
?>