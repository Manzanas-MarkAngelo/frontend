<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);
$materialIds = isset($data['materialIds']) ? $data['materialIds'] : [];

if (empty($materialIds)) {
    echo json_encode(['error' => 'No materials selected']);
    exit;
}

$placeholders = implode(',', array_fill(0, count($materialIds), '?'));
$sql = "UPDATE materials 
        SET status = 'Weed Out' 
        WHERE id IN ($placeholders) 
        AND status = 'Available'";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
}

$types = str_repeat('i', count($materialIds));
$stmt->bind_param($types, ...$materialIds);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Materials updated to Weed Out']);
} else {
    echo json_encode(['error' => 'Failed to update materials']);
}

$stmt->close();
$conn->close();
?>