<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS'); // Allow DELETE and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Retrieve the subject_id from the query string
if (isset($_GET['id'])) {
    $subject_id = intval($_GET['id']); // Sanitize and convert to integer for security

    // Prepare the SQL statement to delete the subject
    $stmt = $conn->prepare("DELETE FROM subjects WHERE id = ?");
    $stmt->bind_param("i", $subject_id);

    // Execute the statement and check if it was successful
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Subject deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete subject']);
    }

    // Close the statement
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid subject ID']);
}

// Close the database connection
$conn->close();
?>
