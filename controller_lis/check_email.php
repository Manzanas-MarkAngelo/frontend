<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

$query = "SELECT id FROM admin WHERE email = ? UNION SELECT id FROM librarian WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $email, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["found" => true]);
} else {
    echo json_encode(["found" => false]);
}
?>