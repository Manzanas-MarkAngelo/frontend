<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'])) {
    $id = $data['id'];

    $stmt = $conn->prepare("DELETE FROM departments WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete department']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid department ID']);
}

$conn->close();
?>