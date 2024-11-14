<?php
    // STOP TASK

    include_once '../serverData.php';

    $taskId=$_POST['taskId'] ?? 1;
    $userId=$_POST['userId'] ?? 1;
    $taskId=$_POST['statusId'] ?? 1;

    $conn = new mysqli($server, $username, $password, $db );


    $resultJson = '{
        "success": false,
        "data": [],
        "message": "Could not update
    }';

    // STEP ONE. FIND TASK
        $sql = "SELECT * FROM tasks WHERE task_id={$taskId}";
        $result=$conn->query($sql);
        if ($result->num_rows>0) {
            $row = $result->fetch_assoc();
            $date =  date('Y-m-d H:i:s');
            $sql = "
                UPDATE tasks_tracker SET 
                    end_date='{$date}'
                WHERE task_track_id={$id}
            ";
        }

    // STEP TWO. START NEW DETAIL


    // Create new entry and start it


    $conn->close();

    echo $resultJson;
?>