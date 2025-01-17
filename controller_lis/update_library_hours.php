<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$opening_time = $data['openingTime'] ?? null;
$closing_time = $data['closingTime'] ?? null;

if ($opening_time && $closing_time) {
    $sql = "UPDATE library_hours 
            SET opening_time = ?, closing_time = ? 
            WHERE id = 1"; // Assuming there's only one row to update
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $opening_time, $closing_time);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Library hours updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update library hours.']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid opening or closing time.']);
}

$conn->close();
?>
