<?php
    include_once '../serverData.php';
    $conn = new mysqli($server, $username, $password, $db );

    parse_str(file_get_contents("php://input"),$putData);

    $taskId=$putData['taskId'];

    $sql="
        UPDATE tasks SET
            active=NOT active
        WHERE task_id={$taskId}
    ";

    $conn->query($sql);
    echo '{ "success": true, "message": "Task Deleted"}';

    $conn->close();
?>