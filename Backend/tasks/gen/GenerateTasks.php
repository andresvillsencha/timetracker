<?php

include_once '../../serverData.php';

$conn = new mysqli($server, $username, $password, $db );

    $tasks = 10;
    $events = 4;
    $admins = [ 1, 3 ];
    $users = [ 1,2,3,4,5,2,4,5 ];

    $randomNotes = [
        [ "planning", "internal discussion", "daily", "review", "retrospective" ],
        [ "DB planning", "analysis" ],
        [ "coding", "migration", "bug fixes" ],
        [ "short bathroom break" ],
        [ "1 hour lunch" ],
        [ "review", "presentation", "requirements" ]
    ];

    $subtasks = [ 0, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 1];

     $today = date('Y-m-d H:i:s');
    $insertedId=0;

    for ($month=12;$month<=12; $month++) {
        $startDate = date('Y-m-d H:i:s', strtotime('11/01/2024'));
        for ($day=1; $day<=30; $day++) {
            $ddays = rand(1,10);
            $date = date('Y-m-d H:i:s', strtotime("{$month}/{$ddays}/2024"));
            $tasksThisDay=rand(floor($tasks/2),$tasks);
            
            for ($task=0; $task<$tasksThisDay; $task++) {
                $time = rand(8,20);
                $min = rand(0,3)*15;
                $deadline = date('Y-m-d H:i:s', strtotime("{$month}/{$day}/2024 $time:$min:00"));
                $pos=rand(0,count($users)-1);
                $user = $users[$pos];
                $admin = $admins[rand(0,1)];
                $subtask = $subtasks[rand(0,count($subtasks)-1)];
                $status = (date_create($deadline)<date_create($today) || rand(1,10)>8) ? 5 : ($subtask == 0 ? 2 : 4) ;
                $activity = rand(1,6);
                $time = rand(1,4);
                $notes = $randomNotes[($activity-1)];
                $note = $notes[rand(0,count($notes)-1)];
                $sql = "
                    INSERT INTO tasks
                    (created_by,assigned_to,creation_date,activity_id,status_id,active,estimated_time,deadline_date,notes)
                    VALUES
                    ({$admin},{$user},'{$startDate}',{$activity},{$status},1,{$time},'{$deadline}','{$note}')
                ";
                $conn->query($sql);
                $insertedId=$conn->insert_id;
                echo "Created $insertedId: $deadline ($status) <br>";
                for ($sub=0;$sub<$subtask;$sub++) {
                    $statusId = ($sub>=$subtask) ? $status : 3;
                    $newDay = rand(0,10)-8;
                    $newDay = ($newDay>0) ? "+ $newDay" : "$newDay" ;
                    $startDateT = date('Y-m-d H:i:s', strtotime("$deadline $newDay days"));
                    $duration = rand(15,$time*60); // time in minutes
                    $endDateT = date('Y-m-d H:i:s',strtotime("{$startDateT} + {$duration} minute"));
                    echo " - ($statusId) $newDay // $endDateT // $duration minutes<br>";
                    $sql = "
                        INSERT INTO tasks_tracker
                        (task_id,user_id,start_date,end_date,status_id,active,notes)
                        VALUES
                        ({$insertedId},{$user},'{$startDateT}','{$endDateT}',$statusId,1,'')
                    ";
                }
    
                $conn->query($sql);
            }
        }
    }
    
    $conn->close();

?>