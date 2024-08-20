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
$material_id = $data['material_id'] ?? null;
$remark = $data['remark'] ?? null;

if ($material_id && $remark) {
    $sql = "UPDATE borrowing SET remark = ? WHERE material_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $remark, $material_id);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update remark.']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid material ID or remark.']);
}

$conn->close();
?>