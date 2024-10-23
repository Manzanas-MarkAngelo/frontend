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

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get year and month from the request, default to current year/month if not provided
$year = isset($_GET['year']) ? (int)$_GET['year'] : date('Y');
$month = isset($_GET['month']) ? (int)$_GET['month'] : date('m');

// Query to get the course counts based on the provided year and month
$query = "
    SELECT courses.course_abbreviation, COUNT(*) as student_count
    FROM time_log
    INNER JOIN students ON time_log.user_id = students.id
    INNER JOIN courses ON students.course_id = courses.id
    WHERE YEAR(time_log.time_in) = ? AND MONTH(time_log.time_in) = ?
    GROUP BY courses.course_abbreviation
";

// Prepare and execute the query with year and month as parameters
$stmt = $conn->prepare($query);
$stmt->bind_param('ii', $year, $month);
$stmt->execute();
$result = $stmt->get_result();

// Prepare the response
$course_counts = [];
while ($row = $result->fetch_assoc()) {
    $course_counts[] = [
        'course_abbreviation' => $row['course_abbreviation'],
        'student_count' => $row['student_count']
    ];
}

// Output the result as JSON
echo json_encode($course_counts);

// Close the connection
$stmt->close();
$conn->close();
?>
