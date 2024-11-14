<?php


    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            include 'event/post.php';
            break;
        case 'PUT':
            include 'event/put.php';
            break;
        case 'DELETE':
            include 'event/delete.php';
            break;
        default:
            echo '{ "success": false, "message": "Incorrect verb"}';
    }



?>