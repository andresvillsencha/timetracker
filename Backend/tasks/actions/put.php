<?php
    include_once '../serverData.php';

    parse_str(file_get_contents("php://input"),$putData);

    $conn = new mysqli($server, $username, $password, $db );

    $data = [
        "created_by" => $conn->real_escape_string($putData['created_by']),
        "assigned_to" => $conn->real_escape_string($putData['assigned_to']),
        "activity_id" => $conn->real_escape_string($putData['activity_id']),
        "status_id" => 1,
        "active" => 1,
        "estimated_time" => $conn->real_escape_string($putData['estimated_time']),
        "deadline_date"=> date('Y-m-d H:i:s', strtotime($putData['deadline_date'])),
        "notes" => $conn->real_escape_string($putData['notes'])
    ];

    $taskId=$putData['taskId'];
    $sql="
        UPDATE tasks SET
            created_by={$data['created_by']},
            assigned_to={$data['assigned_to']}, 
            activity_id={$data['activity_id']}, 
            status_id={$data['status_id']},
            active={$data['active']}, 
            estimated_time= {$data['estimated_time']}, 
            deadline_date='{$data['deadline_date']}', 
            notes='{$data['notes']}'
        WHERE task_id={$taskId}
    ";

    $conn->query($sql);
    echo '{ "success": true, "message": "Task Updated"}';

    $conn->close();
?>