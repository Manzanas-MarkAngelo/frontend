<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

$user_id = $data['user_id'];
$school = $data['school'];
$gender = $data['gender'];
$first_name = $data['first_name'];
$surname = $data['surname'];
$identifier = $data['identifier'];
$phone_number = $data['phone_number'];

$query = "UPDATE visitor 
          SET school = ?, gender = ?, first_name = ?, surname = ?, identifier = ?, phone_number = ?, updated_at = NOW()
          WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('ssssssi', $school, $gender, $first_name, $surname, $identifier, $phone_number, $user_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>