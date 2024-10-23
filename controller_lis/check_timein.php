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

$identifier = $data['identifier'] ?? null;

if ($identifier === null) {
    echo json_encode(['timein' => false, 'error' => 'Missing identifier']);
    exit();
}

// Include PUPT-Employee check here
$query = "SELECT user_id FROM students WHERE student_number = ? 
          UNION 
          SELECT user_id FROM faculty WHERE emp_number = ?
          UNION
          SELECT user_id FROM visitor WHERE identifier = ?
          UNION
          SELECT user_id FROM pupt_employees WHERE emp_num = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $identifier, $identifier, $identifier, $identifier);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($user_id);
    $stmt->fetch();

    $log_query = "SELECT id FROM time_log WHERE user_id = ? AND time_out IS NULL";
    $log_stmt = $conn->prepare($log_query);
    $log_stmt->bind_param("i", $user_id);
    $log_stmt->execute();
    $log_stmt->store_result();

    if ($log_stmt->num_rows > 0) {
        echo json_encode(['timein' => true, 'user_id' => $user_id]);
    } else {
        echo json_encode(['timein' => false]);
    }

    $log_stmt->close();
} else {
    echo json_encode(['timein' => false]);
}

$stmt->close();
$conn->close();
?>