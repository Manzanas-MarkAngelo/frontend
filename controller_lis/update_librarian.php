<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$name = $data['name'];
$email = $data['email'];
$telephone_number = $data['telephone_number'];
$telefax_number = $data['telefax_number'];
$username = $data['username'];
$password = $data['password'];

if (!empty($data['newPassword'])) {
    $password = hash('sha256', $data['newPassword']);
}

$query = "UPDATE librarian SET 
          name = '$name', 
          email = '$email', 
          telephone_number = '$telephone_number', 
          telefax_number = '$telefax_number', 
          username = '$username', 
          password = '$password' 
          WHERE id = $id";

if (mysqli_query($conn, $query)) {
    echo json_encode(['message' => 'Librarian updated successfully']);
} else {
    echo json_encode(['message' => 'Failed to update librarian']);
}
?>