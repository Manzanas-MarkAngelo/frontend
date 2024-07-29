<?php
include 'db_connection.php';

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

$role = $data['role'] ?? null;
$identifier = $data['identifier'] ?? null;

if ($role === null || $identifier === null) {
    echo json_encode(['registered' => false, 'error' => 'Invalid input data']);
    exit();
}

if ($role === 'Student') {
    $query = "SELECT user_id FROM students WHERE student_number = ?";
} elseif ($role === 'Faculty') {
    $query = "SELECT user_id FROM faculty WHERE emp_number = ?";
} elseif ($role === 'Visitor') {
    $query = "SELECT user_id FROM visitors WHERE surname = ?";
} else {
    echo json_encode(['registered' => false, 'error' => 'Invalid role']);
    exit();
}

$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['registered' => false, 'error' => $conn->error]);
    exit();
}

$stmt->bind_param("s", $identifier);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($user_id);
    $stmt->fetch();
    echo json_encode(['registered' => true, 'user_id' => $user_id]);
} else {
    echo json_encode(['registered' => false]);
}

$stmt->close();
$conn->close();
?>