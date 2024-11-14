<?php
    // START TASK

    include_once '../serverData.php';

    $conn = new mysqli($server, $username, $password, $db );


    $taskId = $_POST['taskId'] ?? 0;
    $userId = $_POST['userId'] ?? 0;
    $statusId = $_POST['statusId'] ?? 0;
    $date = date('Y-m-d H:i:s');
    $notes =  $conn->real_escape_string($_POST['notes'] ?? "");


    $resultJson = '{
        "data": [],
        "success": false,
        "message": "Could not start/stop task"
    }';

    // STEP ONE. CHANGE TASK STATUS
        $sql = "SELECT * FROM tasks WHERE task_id={$taskId}";
        $task=$conn->query($sql);
        if ($task->num_rows>0) {
            $sql = "UPDATE tasks SET status_id={$statusId} WHERE task_id={$taskId}";
            $conn->query($sql);
        }

    // STEP TWO. Review Status
        // Paused, finished, or cancelled => stop running detail (4,5,6)
        // In Progress => Start new entry (3)
        if ($task->num_rows>0) {
            if ($statusId==3) {
                // START
                    $sql="
                        INSERT INTO tasks_tracker 
                        ( user_id, task_id, status_id, start_date, notes, active ) 
                        VALUES 
                        ( {$userId}, {$taskId}, {$statusId}, '{$date}', '{$notes}', 1)
                    ";
                    $conn->query($sql);
                    $resultJson = '{
                        "data": [ "taskId": '.$taskId.', "trackerId": '.$conn->insert_id.'],
                        "success": true,
                        "message": "Task Started"
                    }';
            } else if ($statusId>=4 && $statusId<=6) {
                // STOP
                    // Update latest event, and stop it
                        // Get task Id 
                            $sql="SELECT MAX(task_track_id) as selected FROM tasks_tracker WHERE task_id={$taskId}";
                            $res = $conn->query($sql);
                            if ($res->num_rows>0) {
                                $row=$res->fetch_assoc();
                                $taskTrackerId = $row['selected'];
                                $sql="
                                    UPDATE tasks_tracker SET
                                        end_date='{$date}', 
                                        notes='{$notes}'
                                    WHERE task_track_id={$taskTrackerId}
                                ";
                                $conn->query($sql);
                                $resultJson = '{
                                    "data": [ "taskId": '.$taskId.', "trackerId": '.$taskTrackerId.'],
                                    "success": true,
                                    "message": "Task Stopped"
                                }';
                            }
                            
            }
        }

    // Create new entry and start it


    $conn->close();

    echo $resultJson;
?>