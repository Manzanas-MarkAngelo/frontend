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

// Get page number and page size from the query parameters
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$pageSize = isset($_GET['pageSize']) ? intval($_GET['pageSize']) : 10;

// Calculate the offset for the SQL query
$offset = ($page - 1) * $pageSize;

// Retrieve the total number of departments
$totalDepartmentsResult = $conn->query("SELECT COUNT(*) AS total FROM departments");
$totalDepartmentsRow = $totalDepartmentsResult->fetch_assoc();
$totalDepartments = intval($totalDepartmentsRow['total']);
$totalPages = ceil($totalDepartments / $pageSize);

// Retrieve the paginated results
$sql = "SELECT * FROM departments LIMIT $offset, $pageSize";
$result = $conn->query($sql);

$departments = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }
}

// Prepare the response
$response = [
    'page' => $page,
    'pageSize' => $pageSize,
    'totalDepartments' => $totalDepartments,
    'totalPages' => $totalPages,
    'departments' => $departments
];

echo json_encode($response);

$conn->close();
?>
