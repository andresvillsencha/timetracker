<?php
    include_once '../serverData.php';
    $conn = new mysqli($server, $username, $password, $db );

    $data = [
        "created_by" => $conn->real_escape_string($_POST['created_by']),
        "assigned_to" => $conn->real_escape_string($_POST['assigned_to']),
        "creation_date" => date('Y-m-d H:i:s'),
        "activity_id" => $conn->real_escape_string($_POST['activity_id']),
        "status_id" => 2,
        "active" => 1,
        "estimated_time" => $conn->real_escape_string($_POST['estimated_time']),
        "deadline_date"=> date('Y-m-d H:i:s', strtotime($_POST['deadline_date'])),
        "notes" => $conn->real_escape_string($_POST['notes'])
    ];

    $sql="
        INSERT INTO tasks 
        (
            created_by,
            assigned_to,
            creation_date,
            activity_id,
            status_id,
            active,
            estimated_time,
            deadline_date,
            notes
        ) 
        VALUES 
        (
            {$data['created_by']}, 
            {$data['assigned_to']}, 
            '{$data['creation_date']}', 
            {$data['activity_id']}, 
            {$data['status_id']},
            {$data['active']}, 
            {$data['estimated_time']}, 
            '{$data['deadline_date']}', 
            '{$data['notes']}'
        )
    ";

    $conn->query($sql);
    echo '{ "success": true, "message": "Task Created"}';

    $conn->close();
?>