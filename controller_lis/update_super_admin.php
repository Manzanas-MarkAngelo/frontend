<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$email = $data['email'];
$username = $data['username'];
$password = $data['password'];

if (!empty($data['newPassword'])) {
    $password = hash('sha256', $data['newPassword']);
}

$query = "UPDATE admin SET 
          email = '$email', 
          username = '$username', 
          password = '$password' 
          WHERE id = $id";

if (mysqli_query($conn, $query)) {
    echo json_encode(['message' => 'Admin updated successfully']);
} else {
    echo json_encode(['message' => 'Failed to update admin']);
}
?>