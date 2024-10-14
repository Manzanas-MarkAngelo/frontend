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

// Fetch the search term from the query parameter, if provided
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';

// Modify the SQL query to filter by the search term if it exists
if (!empty($searchTerm)) {
    $sql = "SELECT * FROM subjects WHERE subject_name LIKE ?";
    $stmt = $conn->prepare($sql);
    $searchTerm = '%' . $searchTerm . '%'; // Add wildcards for partial matching
    $stmt->bind_param("s", $searchTerm);
} else {
    $sql = "SELECT * FROM subjects";
    $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

// Check if any rows were fetched
if ($result->num_rows > 0) {
    $subjects = [];

    // Fetch all rows and add them to the subjects array
    while ($row = $result->fetch_assoc()) {
        $subjects[] = $row;
    }

    // Return the subjects as a JSON response
    echo json_encode($subjects);
} else {
    echo json_encode(['error' => 'No subjects found']);
}

$stmt->close();
$conn->close();
?>
