<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight requests
    http_response_code(200);
    exit;
}

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get month and year from the request
$month = isset($_GET['month']) ? intval($_GET['month']) : date('m'); // Default to current month if not provided
$year = isset($_GET['year']) ? intval($_GET['year']) : date('Y'); // Default to current year if not provided

// Debugging: Show the month and year being used
error_log("Month: $month, Year: $year");

// Step 1: Fetch top 10 most borrowed books
$sql = "
    SELECT material_id, COUNT(*) AS times_borrowed
    FROM borrowing
    WHERE MONTH(claim_date) = ? AND YEAR(claim_date) = ?
    GROUP BY material_id
    ORDER BY times_borrowed DESC
    LIMIT 10
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $month, $year);
$stmt->execute();
$result = $stmt->get_result();

$materials = array();
while ($row = $result->fetch_assoc()) {
    $materials[] = array(
        'material_id' => $row['material_id'],
        'times_borrowed' => $row['times_borrowed']
    );
}
$stmt->close();

// Debugging: Show retrieved material IDs
error_log("Retrieved Material IDs: " . implode(', ', array_column($materials, 'material_id')));

// Step 2: Fetch category_id and title for the retrieved material_ids
if (!empty($materials)) {
    $material_ids = array_column($materials, 'material_id');
    $material_ids_placeholder = implode(',', array_fill(0, count($material_ids), '?'));

    $sql = "
        SELECT id, title
        FROM materials
        WHERE id IN ($material_ids_placeholder)
    ";

    // Debugging: Show SQL query and parameters
    error_log("SQL Query: $sql");
    error_log("Material IDs: " . implode(', ', $material_ids));

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(str_repeat('i', count($material_ids)), ...$material_ids);
    $stmt->execute();
    $result = $stmt->get_result();

    $titles = array();
    while ($row = $result->fetch_assoc()) {
        $titles[$row['id']] = $row['title'];
    }
    $stmt->close();

    // Debugging: Show titles retrieved
    error_log("Titles: " . print_r($titles, true));

    // Step 3: Attach titles to the materials array
    foreach ($materials as &$material) {
        $material_id = $material['material_id'];
        $title = isset($titles[$material_id]) ? $titles[$material_id] : 'Unknown';
        $material['title'] = $title;

        // Debugging: Show each material's details
        error_log("Material Details - ID: $material_id, Title: $title, Times Borrowed: " . $material['times_borrowed']);
    }

    $response = array(
        'data' => $materials
    );

    echo json_encode($response);
}

$conn->close();
?>
