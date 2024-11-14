<?php
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Origin: *"); // Replace with your client URL
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
        http_response_code(200); // Respond with OK
        die();
    }



    header("Access-Control-Allow-Origin: *"); // Allows all origins
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allows specific HTTP methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allows specific headers
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    
    $server="localhost";
    $db="timetracker_app";
    $username ="root";
    $password=""; // USE YOUR MYSQL Credentials

    $userId = $_GET['userId'] ?? 0;
    $token  = $_GET['token']  ?? "";
?>