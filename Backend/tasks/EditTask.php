<?php


    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            include 'actions/post.php';
            break;
        case 'PUT':
            include 'actions/put.php';
            break;
        case 'DELETE':
            include 'actions/delete.php';
            break;
        default:
            echo '{ "success": false, "message": "Incorrect verb"}';
    }



?>