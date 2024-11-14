<?php
    include_once '../serverData.php';

    $user = $_POST['username'] ?? "";
    $pass = md5($_POST['password'] ?? "" ) ;

    $conn = new mysqli($server, $username, $password, $db );

    if($conn->connect_errno){
        die("Failed Connection ".$conn->connect_errno);
    }    

    $user = $conn->real_escape_string($user);
    $pass = $conn->real_escape_string($pass);

    $sql = "SELECT * FROM users WHERE (email='{$user}' OR phone_number='{$user}') AND password='{$pass}'";
    $result = $conn->query($sql);

    // IF USER FOUND
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $r_token=bin2hex(random_bytes(20));
        $jsdata=array(
            "token"=>$r_token,
            "name"=>$row["first_name"],
            "email"=>$row["email"],
            "phone"=>$row["phone_number"],
            "id_user"=>$row["user_id"],
            "role_id"=>$row["role_id"],
            "success"=> true,
            "message"=> "Ok"
        );

        // UPDATE TOKEN
            $id = $row["user_id"]; 
            $stmt = $conn->prepare("UPDATE users SET token=? WHERE user_id=?");
            if ($stmt === false) {
                die("Connection Error: " . $conn->error);
            }
            $stmt->bind_param("si", $r_token,$id);
            if (!$stmt->execute()) {
                echo "Couldn't update row: " . $stmt->error;
            }
        echo json_encode($jsdata);
    } else {
        echo '{ "success": false, "message": "Invalid Credentials"}';
    }
    $conn->close();
?>
