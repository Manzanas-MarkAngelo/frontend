<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$logType = $data['logType'] ?? '';
$itemsPerPage = $data['itemsPerPage'] ?? 13;
$page = $data['page'] ?? 1;
$offset = ($page - 1) * $itemsPerPage;

switch ($logType) {
    case 'student':
        $query = "SELECT student_number, CONCAT(surname, ', ', first_name) as name, time_in, time_out 
                  FROM students s 
                  JOIN time_log t ON s.user_id = t.user_id 
                  ORDER BY t.time_in DESC
                  LIMIT $itemsPerPage 
                  OFFSET $offset";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM students s 
                       JOIN time_log t ON s.user_id = t.user_id";
        break;
    case 'faculty':
        $query = "SELECT emp_number as faculty_code, CONCAT(surname, ', ', first_name) as name, time_in, time_out 
                  FROM faculty f 
                  JOIN time_log t ON f.user_id = t.user_id 
                  ORDER BY t.time_in DESC
                  LIMIT $itemsPerPage 
                  OFFSET $offset";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM faculty f 
                       JOIN time_log t ON f.user_id = t.user_id";
        break;
    case 'visitor':
        $query = "SELECT CONCAT(surname, ', ', first_name) as name, school, time_in, time_out 
                  FROM visitor v 
                  JOIN time_log t ON v.user_id = t.user_id 
                  ORDER BY t.time_in DESC
                  LIMIT $itemsPerPage 
                  OFFSET $offset";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM visitor v 
                       JOIN time_log t ON v.user_id = t.user_id";
        break;
    default:
        echo json_encode(['records' => [], 'totalPages' => 0]);
        exit;
}

$result = $conn->query($query);
$logs = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['time_in'] = date('F j, Y, g:i A', strtotime($row['time_in']));
        if ($row['time_out']) {
            $row['time_out'] = date('F j, Y, g:i A', strtotime($row['time_out']));
        }
        $logs[] = $row;
    }
}

$totalResult = $conn->query($countQuery);
$totalRecords = $totalResult->fetch_assoc()['total'];
$totalPages = ceil($totalRecords / $itemsPerPage);

echo json_encode(['records' => $logs, 'totalPages' => $totalPages]);
$conn->close();
?>