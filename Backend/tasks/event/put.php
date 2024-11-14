<?php
    include_once '../serverData.php';

    parse_str(file_get_contents("php://input"),$putData);

    $conn = new mysqli($server, $username, $password, $db );

    $data = [
        "user_id" => $conn->real_escape_string($_POST['user_id']),
        "task_id" => $conn->real_escape_string($_POST['task_id']),
        "status_id" => $conn->real_escape_string($_POST['status_id']),
        "start_date" => date('Y-m-d H:i:s', strtotime($putData['start_date'])),
        "end_date" => date('Y-m-d H:i:s', strtotime($putData['end_date'])),
        "notes" => $conn->real_escape_string($_POST['notes']),
        "active" => 1
    ];

    $taskTrackId=$putData['taskTrackId'];
    $sql="
        UPDATE tasks_Tracker SET
            user_id={$data['user_id']},
            task_id={$data['task_id']}, 
            status_id={$data['status_id']}, 
            start_date= {$data['start_date']}, 
            end_date= {$data['end_date']}, 
            notes='{$data['notes']}',
            active={$data['active']}
        WHERE task_track_id={$taskTrackId}
    ";

    $conn->query($sql);
    echo '{ "success": true, "message": "Task Details Updated"}';

    $conn->close();
?>