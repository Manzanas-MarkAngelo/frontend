<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$logType = $data['logType'] ?? '';

switch ($logType) {
    case 'student':
        $query = "SELECT student_number, CONCAT(surname, ', ', first_name) as name, time_in, time_out, DATE(time_in) as date 
                  FROM students s 
                  JOIN time_log t ON s.user_id = t.user_id";
        break;
    case 'faculty':
        $query = "SELECT emp_number as faculty_code, CONCAT(surname, ', ', first_name) as name, time_in, time_out, DATE(time_in) as date 
                  FROM faculty f 
                  JOIN time_log t ON f.user_id = t.user_id";
        break;
    case 'visitor':
        $query = "SELECT CONCAT(surname, ', ', first_name) as name, school, time_in, time_out, DATE(time_in) as date 
                  FROM visitors v 
                  JOIN time_log t ON v.user_id = t.user_id";
        break;
    default:
        echo json_encode([]);
        exit;
}

$result = $conn->query($query);
$logs = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
}

echo json_encode($logs);
$conn->close();
?>