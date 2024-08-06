<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$user_id = $data['user_id'];
$emp_number = $data['emp_number'];
$first_name = $data['first_name'];
$surname = $data['surname'];
$gender = $data['gender'];
$department = $data['department'];
$phone_number = $data['phone_number'];

$query = "UPDATE faculty SET 
            emp_number = ?, 
            first_name = ?, 
            surname = ?, 
            gender = ?, 
            department = ?, 
            phone_number = ? 
          WHERE user_id = ?";
$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['error' => $conn->error]);
    exit;
}
$stmt->bind_param('sssssss', $emp_number, $first_name, $surname, $gender, $department, $phone_number, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>