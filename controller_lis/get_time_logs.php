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
$startDate = $data['startDate'] ?? '';
$endDate = $data['endDate'] ?? '';

$startDate = $startDate ? date('Y-m-d 00:00:00', strtotime($startDate)) : '';
$endDate = $endDate ? date('Y-m-d 23:59:59', strtotime($endDate)) : '';

$whereClause = '';
if ($startDate && $endDate) {
    $whereClause = " AND t.time_in BETWEEN '$startDate' AND '$endDate'";
}

switch ($logType) {
    case 'student':
        $query = "SELECT s.student_number, CONCAT(s.surname, ', ', s.first_name) as name, t.time_in, t.time_out, c.course_abbreviation AS course 
                  FROM students s 
                  JOIN time_log t ON s.user_id = t.user_id 
                  LEFT JOIN courses c ON s.course_id = c.id
                  WHERE 1=1 $whereClause
                  ORDER BY t.time_in DESC
                  LIMIT $itemsPerPage 
                  OFFSET $offset";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM students s 
                       JOIN time_log t ON s.user_id = t.user_id
                       LEFT JOIN courses c ON s.course_id = c.id
                       WHERE 1=1 $whereClause";
        break;
    case 'faculty':
        $query = "SELECT f.emp_number as faculty_code, CONCAT(f.surname, ', ', f.first_name) as name, t.time_in, t.time_out, d.dept_abbreviation AS department
                  FROM faculty f 
                  JOIN time_log t ON f.user_id = t.user_id 
                  LEFT JOIN departments d ON f.dept_id = d.id
                  WHERE 1=1 $whereClause
                  ORDER BY t.time_in DESC
                  LIMIT $itemsPerPage 
                  OFFSET $offset";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM faculty f 
                       JOIN time_log t ON f.user_id = t.user_id
                       LEFT JOIN departments d ON f.dept_id = d.id
                       WHERE 1=1 $whereClause";
        break;
    case 'visitor':
        $query = "SELECT CONCAT(v.surname, ', ', v.first_name) as name, v.school, t.time_in, t.time_out 
                  FROM visitor v 
                  JOIN time_log t ON v.user_id = t.user_id 
                  WHERE 1=1 $whereClause
                  ORDER BY t.time_in DESC
                  LIMIT $itemsPerPage 
                  OFFSET $offset";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM visitor v 
                       JOIN time_log t ON v.user_id = t.user_id
                       WHERE 1=1 $whereClause";
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