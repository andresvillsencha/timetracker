<?php
    include_once '../serverData.php';


    $tasks = 10;
    $events = 4;
    $users = [ 3, 4, 5 ];

    $conn = new mysqli($server, $username, $password, $db );

    for ($i=0; $i<$tasks; $i++) {
        $data = [
            "created_by" => 2,
            "assigned_to" => $users[rand(0,2)],
            "creation_date" => date('Y-m-d H:i:s'),
            "activity_id" => rand(1,6),
            "status_id" => rand(1,6),
            "active" => 1,
            "estimated_time" => rand(1,8),
            "deadline_date"=> date('Y-m-d H:i:s'),
            "notes" => ""
        ];

        var_dump($data);

        $sql="
            INSERT INTO tasks 
            (created_by,assigned_to,creation_date,activity_id,status_id,active,estimated_time,deadline_date,notes) 
            VALUES 
            ({$data['created_by']}, {$data['assigned_to']}, '{$data['creation_date']}', {$data['activity_id']}, {$data['status_id']}, {$data['active']}, {$data['estimated_time']}, '{$data['deadline_date']}', '{$data['notes']}')
        ";

        $conn->query($sql);
/*

        $stmt = $conn->prepare("INSERT INTO tasks (created_by,assigned_to,creation_date,activity_id,status_id,active,estimated_time,deadline_date) VALUES (?,?,?,?,?,?,?,?)");

        $stmt->bind_param("iisiiiis", $data->created_by, $data->assigned_to, $data->creation_date, $data->activity_id, $data->status_id, $data->active, $data->estimated_time, $data->deadline_date);
        $stmt->execute();*/

    }
    echo "Created {$tasks} Rows";


    $conn->close();

?>