<?php
    include_once '../serverData.php';

    $pageStart=$_GET['start'] ?? 0;
    $pageLimit=$_GET['limit'] ?? 50;

    $dateColumns = [ 'deadline_date' ];

    $filters = json_decode($_GET['filter'] ?? "[]");
    $sortBy = json_decode($_GET['sort'] ?? "[]");

    $taskId = $_GET['taskId'] ?? 0;

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

            if ($taskId!==0) {
                $filterString.=($filterString=="" ? "" : "AND"). " task_id={$taskId} ";
            }
            if ($filterString!="") {
                $filterString="WHERE".$filterString;
            }

        $sql="
            SELECT 
                SQL_CALC_FOUND_ROWS 
                * 
            FROM
            (
                SELECT 
                    tasks_tracker.*,
                    CONCAT(users.first_name,' ',users.last_name) as full_name,
                    `status`.`status`,
                    `status`.`color`
                FROM tasks_tracker
                    INNER JOIN users ON tasks_tracker.user_id=users.user_id
                    INNER JOIN `status` ON tasks_tracker.status_id=`status`.`status_id`
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