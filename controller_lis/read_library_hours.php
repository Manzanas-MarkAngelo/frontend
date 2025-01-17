<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// SQL query to fetch the library hours (assuming there's only one row)
$sql = "SELECT opening_time, closing_time FROM library_hours ORDER BY created_at DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Fetch the data and output it as a JSON response
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No library hours found']);
}

$conn->close();
?>
