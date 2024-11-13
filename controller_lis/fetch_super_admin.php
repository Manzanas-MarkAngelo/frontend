<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$id = $_GET['id'];
$query = "SELECT * FROM admin WHERE id = $id";
$result = mysqli_query($conn, $query);

$admin = mysqli_fetch_assoc($result);
echo json_encode($admin);
?>