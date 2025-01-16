<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['date']) || empty($input['date'])) {
        echo json_encode(['success' => false, 'message' => 'Date is required']);
        http_response_code(400);
        exit;
    }

    $date = $input['date'];

    $sql = "DELETE FROM excluded_days WHERE date = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param('s', $date);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['success' => true, 'message' => 'Date deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Date not found']);
                http_response_code(404);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error executing query']);
            http_response_code(500);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Error preparing query']);
        http_response_code(500);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    http_response_code(405);
}
$conn->close();
?>