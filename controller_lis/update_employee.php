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

if (!isset(
    $data['user_id'], 
    $data['emp_num'], 
    $data['first_name'], 
    $data['surname'], 
    $data['gender'], 
    $data['phone_number'], 
    $data['email']
)) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$user_id = $data['user_id'];
$emp_num = $data['emp_num'];
$first_name = $data['first_name'];
$surname = $data['surname'];
$gender = $data['gender'];
$phone_number = $data['phone_number'];
$email = $data['email'];

$query = "UPDATE pupt_employees SET 
            emp_num = ?, 
            first_name = ?, 
            surname = ?, 
            gender = ?, 
            phone_number = ?, 
            email = ?
          WHERE user_id = ?";

$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['error' => $conn->error]);
    exit;
}

$stmt->bind_param(
    'ssssssi', 
    $emp_num, 
    $first_name, 
    $surname, 
    $gender, 
    $phone_number, 
    $email, 
    $user_id
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Employee updated successfully.']);
} else {
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>