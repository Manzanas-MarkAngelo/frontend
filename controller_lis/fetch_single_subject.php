<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the subject ID from the query parameters
$subjectId = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($subjectId !== null) {
    // SQL query to fetch a single subject based on the provided ID
    $sql = "SELECT * FROM subjects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $subjectId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $subject = $result->fetch_assoc();

    if ($subject) {
        echo json_encode($subject);
    } else {
        echo json_encode(['error' => 'Subject not found']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Invalid subject ID']);
}

$conn->close();
?>
