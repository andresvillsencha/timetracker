<?php
    // parse_str(file_get_contents("php://input"),$putData);

    $where="";
    include_once '_dateFilter.php';

    $sql="
        


SELECT 
    CONCAT(m_billed,'/',y_billed) AS month_billed,
    SUM(billed) as total_billed
FROM 
(
    SELECT 
        tasks.task_id,
        activities.price,
        elapsed_time,
        estimated_time,
        (elapsed_time*activities.price) AS billed,
        MONTH(deadline_date) m_billed,
        YEAR(deadline_date) y_billed,
        CONCAT(MONTH(deadline_date),'/',YEAR(deadline_date)) AS month_billed
    FROM
    (
        SELECT 
            SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))/3600) as elapsed_time,
            task_id
        FROM tasks_tracker
        WHERE active=1 AND status_id=3 
        GROUP BY task_id
    ) qTaskTime
    INNER JOIN tasks ON qTaskTime.task_id=tasks.task_id
    INNER JOIN activities ON tasks.activity_id=activities.activity_id
   ) qAll
   GROUP BY y_billed, m_billed
   ORDER BY y_billed, m_billed



    ";

    include_once '_genData.php';

    
?>