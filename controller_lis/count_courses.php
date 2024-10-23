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

// Query to get the course counts dynamically
$query = "
    SELECT courses.course_abbreviation, COUNT(*) as student_count
    FROM time_log
    INNER JOIN students ON time_log.user_id = students.id
    INNER JOIN courses ON students.course_id = courses.id
    GROUP BY courses.course_abbreviation
";

// Execute the query
$stmt = $conn->prepare($query);
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
