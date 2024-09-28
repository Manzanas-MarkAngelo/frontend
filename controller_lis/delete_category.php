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

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the input data from the request body
$input = json_decode(file_get_contents('php://input'), true);
$cat_id = isset($input['cat_id']) ? $input['cat_id'] : '';

if (!$cat_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Category ID is required']);
    exit;
}

// Check if there are any materials using this category
$sql = "SELECT counter FROM category WHERE cat_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $cat_id);
$stmt->execute();
$stmt->bind_result($counter);
$stmt->fetch();
$stmt->close();

if ($counter > 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Cannot delete category, there are materials using this category']);
    exit;
}

// Delete the category
$sql = "DELETE FROM category WHERE cat_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $cat_id);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Category deleted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete category']);
}

$stmt->close();
$conn->close();
?>
