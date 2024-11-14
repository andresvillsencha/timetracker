<?php
    include_once '../serverData.php';


    $conn = new mysqli($server, $username, $password, $db );

        $sql="
            SELECT 
                * 
            FROM status
            WHERE active=1
            ORDER BY status
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