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

$data = json_decode(file_get_contents('php://input'), true);

$role = $data['role'] ?? null;
$identifier = $data['identifier'] ?? null;

if ($role === null || $identifier === null) {
    echo json_encode(['registered' => false, 'error' => 'Invalid input data']);
    exit();
}

if ($role === 'student') {
    $query = "SELECT id FROM students WHERE student_number = ?";
} elseif ($role === 'faculty') {
    $query = "SELECT id FROM faculty WHERE emp_number = ?";
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
    echo json_encode(['registered' => true, 'message' => 'The identifier already exists.']);
} else {
    echo json_encode(['registered' => false, 'message' => 'The identifier is available.']);
}

$stmt->close();
$conn->close();
?>