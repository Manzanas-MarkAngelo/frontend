<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = $input['user_id'] ?? null;

    if ($user_id) {
        $query = "DELETE FROM pupt_employees WHERE user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Employee deleted successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete employee.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid user ID.']);
    }
}

$conn->close();
?>