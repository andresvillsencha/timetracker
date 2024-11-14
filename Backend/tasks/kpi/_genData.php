<?php 

    include_once '../../serverData.php';
    $conn = new mysqli($server, $username, $password, $db );

    $result=$conn->query($sql);
    $totalRows = $result->num_rows;

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