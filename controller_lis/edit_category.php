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
$mat_type = isset($input['mat_type']) ? $input['mat_type'] : '';
$cat_type = isset($input['cat_type']) ? $input['cat_type'] : '';
$accession_no = isset($input['accession_no']) ? $input['accession_no'] : '';
$duration = isset($input['duration']) ? $input['duration'] : null;

// Check if all required fields are provided
if (!$cat_id || !$mat_type || !$cat_type || !$accession_no) {
    http_response_code(400);
    echo json_encode(['error' => 'Required fields are missing']);
    exit;
}

// Update the category in the database
$sql = "UPDATE category SET mat_type = ?, cat_type = ?, accession_no = ?, duration = ? WHERE cat_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $mat_type, $cat_type, $accession_no, $duration, $cat_id);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Category updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update category']);
}

$stmt->close();
$conn->close();
?>
