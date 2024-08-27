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

if (!isset($data['user_id'], $data['emp_number'], $data['first_name'], $data['surname'], $data['gender'], $data['dept_id'], $data['phone_number'])) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$user_id = $data['user_id'];
$emp_number = $data['emp_number'];
$first_name = $data['first_name'];
$surname = $data['surname'];
$gender = $data['gender'];
$dept_id = $data['dept_id'];
$phone_number = $data['phone_number'];

$query = "UPDATE faculty SET 
            emp_number = ?, 
            first_name = ?, 
            surname = ?, 
            gender = ?, 
            dept_id = ?, 
            phone_number = ? 
          WHERE user_id = ?";
$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['error' => $conn->error]);
    exit;
}

$stmt->bind_param('ssssisi', $emp_number, $first_name, $surname, $gender, $dept_id, $phone_number, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>