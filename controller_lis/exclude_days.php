<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['dates'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$dates = $data['dates'];
foreach ($dates as $date) {
    $query = "INSERT IGNORE INTO excluded_days (date) VALUES ('$date')";
    mysqli_query($conn, $query);
}

echo json_encode(['status' => 'success']);
?>