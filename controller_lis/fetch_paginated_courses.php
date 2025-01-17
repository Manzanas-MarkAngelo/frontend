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

// Calculate the offset and limit for the SQL query
$offset = ($page - 1) * $pageSize;

// Retrieve total number of courses
$totalCoursesResult = $conn->query("SELECT COUNT(*) AS total FROM courses");
$totalCoursesRow = $totalCoursesResult->fetch_assoc();
$totalCourses = intval($totalCoursesRow['total']);
$totalPages = ceil($totalCourses / $pageSize);

// Retrieve the paginated results
$sql = "SELECT * FROM courses LIMIT $offset, $pageSize";
$result = $conn->query($sql);

$courses = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
}

// Prepare the response
$response = [
    'page' => $page,
    'pageSize' => $pageSize,
    'totalCourses' => $totalCourses,
    'totalPages' => $totalPages,
    'courses' => $courses
];

echo json_encode($response);

$conn->close();
?>
