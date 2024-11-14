<?php
    include_once '../serverData.php';

    $pageStart=$_GET['start'] ?? 0;
    $pageLimit=$_GET['limit'] ?? 50;

    $dateColumns = [ 'deadline_date' ];

    $filters = json_decode($_GET['filter'] ?? "[]");
    $sortBy = json_decode($_GET['sort'] ?? "[]");

    $conn = new mysqli($server, $username, $password, $db );

        // LETS BUILD THE SQL SORT STRING
            $sortString="";
            for ($i=0; $i<count($sortBy); $i++) {
                $obj = $sortBy[$i];
                $sortString.=($i==0 ? "" : ",")." {$obj->property} {$obj->direction}";
                
            }
            if ($sortString!="") {
                $sortString="ORDER BY ".$sortString;
            }

        // LETS BUILD THE SQL FILTERS

            $filterString="";

            for ($i=0; $i<count($filters); $i++) {
                $obj = $filters[$i];
                $property=$conn->real_escape_string($obj->property);
                // date
                    if (array_search($property,$dateColumns)!==false) {
                        $property = "DATE($property)";
                        $obj->value = date ('Y-m-d', strtotime($obj->value));
                    }
                switch ($obj->operator) {
                    case '>': case '>=': case 'gt':
                        $operator=">=";
                        $value=$conn->real_escape_string($obj->value);
                        $value="'".$value."'";
                        break;
                    case '<': case '<=': case 'lt':
                        $operator="<=";
                        $value=$conn->real_escape_string($obj->value);
                        $value="'".$value."'";
                        break;
                    case '=': case '==': case 'eq':
                        $operator="=";
                        $value=$conn->real_escape_string($obj->value);
                        $value="'".$value."'";
                        break;
                    case '!=': case '<>':
                        $operator="<>";
                        $value=$conn->real_escape_string($obj->value);
                        $value="'".$value."'";
                        break;
                    case 'LIKE': case 'like':
                        $operator="LIKE";
                        $value=$conn->real_escape_string($obj->value);
                        $value="'".$value."%'";
                        break;
                    case 'in':
                        $operator="IN";
                        $value=implode("','",$obj->value);
                        $value="('".$value."')";
                        break;
    
                }
                $filterString.=($i==0 ? "" : "AND")." {$property} {$operator} {$value}";
                
            }
            if ($userId!=0) {
                $filterString.=($filterString=="" ? "" : "AND")." (created_by={$userId} OR assigned_to={$userId})";
            }
            if ($filterString!="") {
                $filterString="WHERE ".$filterString;
            }

        $sql="
            SELECT 
                SQL_CALC_FOUND_ROWS 
                * 
            FROM
            (
            SELECT 
                
                tasks.*,
                status.status,
                status.color,
                activities.activity,
                activities.productive,
                activities.price,
                activities.icon,
                qAdmin.*,
                IFNULL(qUsers.user_id, 0) as user_id,
                IFNULL(qUsers.user_name, '') as user_name,
                IFNULL(qUsers.email, '') as email,
                IFNULL(qUsers.phone_number, '') as phone_number,
                IFNULL(qTime.elapsed_time,0) AS elapsed_time,
                IFNULL(qTime.elapsed_time,0)/60*activities.price AS invoiced_amount
                
            FROM tasks 
                INNER JOIN `status` ON tasks.status_id=`status`.status_id
                INNER JOIN activities ON tasks.activity_id=activities.activity_id
                INNER JOIN (SELECT user_id as admin_id, CONCAT(first_name,' ',last_name) AS admin_name FROM users) qAdmin ON tasks.created_by=qAdmin.admin_id
                LEFT JOIN (SELECT user_id, CONCAT(first_name,' ',last_name) AS user_name, email, phone_number FROM users) qUsers ON tasks.assigned_to=qUsers.user_id
                LEFT JOIN (
                    SELECT 
                        SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))/60) as elapsed_time,
                        task_id
                    FROM tasks_tracker
                    WHERE active=1 AND status_id=3
                    GROUP BY task_id
                ) qTime ON tasks.task_id=qTime.task_id
            ) qAll
            {$filterString}
            {$sortString}
            LIMIT {$pageStart},{$pageLimit}
        ";

        $result=$conn->query($sql);
        $totalRowsResult=$conn->query("SELECT FOUND_ROWS()");
        $totalRows = $totalRowsResult->fetch_array()[0];

        $jsonData="";
        $firstRow=true;
        while ($row = $result->fetch_assoc()) {
            $jsonRow=json_encode($row);
            $jsonData.=(!$firstRow ? ",":"").$jsonRow;
            $firstRow=false;
        }

        echo '{
            "count": '.$totalRows.',
            "success": true,
            "data": ['.$jsonData.']
        }';


    $conn->close();

?>