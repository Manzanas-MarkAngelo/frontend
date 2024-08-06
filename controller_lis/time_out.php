<?php
include 'db_connection.php';

date_default_timezone_set('Asia/Shanghai');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$user_id = $data['user_id'] ?? null;

if ($user_id === null) {
    echo json_encode(['success' => false, 'error' => 'Missing user ID']);
    exit;
}

$time_out = date('Y-m-d H:i:s');

$query = "UPDATE time_log SET time_out = ? WHERE user_id = ? AND time_out IS NULL";
$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['success' => false, 'error' => $conn->error]);
    exit;
}

$stmt->bind_param("si", $time_out, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>