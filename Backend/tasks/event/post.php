<?php
    include_once '../serverData.php';
    $conn = new mysqli($server, $username, $password, $db );

    $data = [
        "user_id" => $conn->real_escape_string($_POST['user_id']),
        "task_id" => $conn->real_escape_string($_POST['task_id']),
        "status_id" => $conn->real_escape_string($_POST['status_id']),
        "start_date" => date('Y-m-d H:i:s'),
        "end_date" => date('Y-m-d H:i:s'),
        "notes" => $conn->real_escape_string($_POST['notes']),
        "active" => 1
    ];

    $sql="
        INSERT INTO tasks_Tracker 
        (
            user_id,
            task_id,
            status_id,
            start_date,
            notes,
            active
        ) 
        VALUES 
        (
            {$data['user_id']}, 
            {$data['task_id']}, 
            {$data['status_id']},
            '{$data['start_date']}', 
            '{$data['notes']}', 
            {$data['active']}
        )
    ";

    $conn->query($sql);
    echo '{ "success": true, "message": "New Task Created"}';

    $conn->close();
?>