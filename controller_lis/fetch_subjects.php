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

// Fetch parameters from the query
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';
$page = isset($_GET['page']) ? intval($_GET['page']) : null;
$limit = 7;  // Set the number of items per page for pagination

// If page parameter is set, apply pagination
if ($page !== null) {
    $offset = ($page - 1) * $limit; // Calculate the offset for the SQL query

    if (!empty($searchTerm)) {
        // Pagination with search term
        $sql = "SELECT * FROM subjects WHERE subject_name LIKE ? LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        $searchTermWildcard = '%' . $searchTerm . '%';
        $stmt->bind_param("sii", $searchTermWildcard, $limit, $offset);
    } else {
        // Pagination without search term
        $sql = "SELECT * FROM subjects LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $limit, $offset);
    }
} else {
    // No pagination, fetch all subjects
    if (!empty($searchTerm)) {
        $sql = "SELECT * FROM subjects WHERE subject_name LIKE ?";
        $stmt = $conn->prepare($sql);
        $searchTermWildcard = '%' . $searchTerm . '%';
        $stmt->bind_param("s", $searchTermWildcard);
    } else {
        $sql = "SELECT * FROM subjects";
        $stmt = $conn->prepare($sql);
    }
}

$stmt->execute();
$result = $stmt->get_result();

$subjects = [];
if ($result->num_rows > 0) {
    // Fetch and add each row to the subjects array
    while ($row = $result->fetch_assoc()) {
        $subjects[] = $row;
    }
    echo json_encode($subjects);
} else {
    echo json_encode(['error' => 'No subjects found']);
}

$stmt->close();
$conn->close();
?>
