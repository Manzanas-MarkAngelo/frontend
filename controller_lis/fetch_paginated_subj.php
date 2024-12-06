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
$page = isset($_GET['page']) ? intval($_GET['page']) : null;
$limit = 5;  // Set the number of items per page for pagination

// If page parameter is set, apply pagination
if ($page !== null) {
    $offset = ($page - 1) * $limit; // Calculate the offset for the SQL query

    // Pagination without search term
    $sql = "SELECT * FROM subjects LIMIT ? OFFSET ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $limit, $offset);
} else {
    // No pagination, fetch all subjects
    $sql = "SELECT * FROM subjects";
    $stmt = $conn->prepare($sql);
}

// Execute the query
$stmt->execute();
$result = $stmt->get_result();

$subjects = [];
if ($result->num_rows > 0) {
    // Fetch and add each row to the subjects array
    while ($row = $result->fetch_assoc()) {
        $subjects[] = $row;
    }
    
    // If page is not set, return all subjects without pagination info
    if ($page !== null) {
        // Add pagination details if pagination is being applied
        $sqlCount = "SELECT COUNT(*) as total FROM subjects";
        $stmtCount = $conn->prepare($sqlCount);
        $stmtCount->execute();
        $countResult = $stmtCount->get_result();
        $totalSubjects = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($totalSubjects / $limit); // Calculate total pages

        // Return data with pagination info
        $response = [
            'subjects' => $subjects,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalSubjects' => $totalSubjects,
            ]
        ];
        echo json_encode($response);
    } else {
        // Return all subjects without pagination info
        echo json_encode(['subjects' => $subjects]);
    }

} else {
    echo json_encode(['error' => 'No subjects found']);
}

$stmt->close();
$conn->close();
?>
