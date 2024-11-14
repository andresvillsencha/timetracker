<?php
    include_once '../serverData.php';
    $conn = new mysqli($server, $username, $password, $db );

    parse_str(file_get_contents("php://input"),$putData);

    $taskTrackId=$putData['taskTrackId'];

    $sql="
        UPDATE tasks_Tracker SET
            active=NOT active
        WHERE task_track_id={$taskTrackId}
    ";

    $conn->query($sql);
    echo '{ "success": true, "message": "Task Detail Deleted"}';

    $conn->close();
?>