<?php
    include_once '../serverData.php';


    $conn = new mysqli($server, $username, $password, $db );


    $q=$_GET['q'] ?? '';
    $query = ($q!="") ? "AND activity LIKE '{$q}%' " : "";

        $sql="
            SELECT 
                * 
            FROM activities
            WHERE active=1 $query
            ORDER BY activity
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