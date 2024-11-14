<?php 
    // INCLUDES
    include_once '../serverData.php';

    // PARAMS
        $id = $_POST['user_id'] ?? 0;
        $token =$_POST['token'] ?? "";


    // LOGIC BEFORE DB CONNECION
        $conn = new mysqli($server ,$username ,$password ,$db );

    // DATABASE QUERY
        $stmt = $conn->prepare("UPDATE users SET token=? WHERE user_id=? AND token=?");
        $stmt->bind_param("si", "", $id, $token);

    // LOGIC AFTER DB CONNECTION
        if ($stmt->execute()) {
            $jsonData=[
                "success"=> true,
                "msg"=> "Logout successfull"
            ];
        } else {
            $jsonData=[
                "success"=> false,
                "msg"=> "Logout unsuccessfull"
            ];
        }
        $stmt->close();

    // RESULT
        echo json_encode($jsonData);
  

        
    ?>