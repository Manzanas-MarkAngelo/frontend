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
$searchTerm = $data['searchTerm'] ?? null;

// Prepare the date range
$startDate = $startDate ? date('Y-m-d 00:00:00', strtotime($startDate)) : '';
$endDate = $endDate ? date('Y-m-d 23:59:59', strtotime($endDate)) : '';

// Initialize the where clause for date filtering
$whereClause = '';
if ($startDate && $endDate) {
    $whereClause .= " AND t.time_in BETWEEN '$startDate' AND '$endDate'";
}

// Set correct timezone
date_default_timezone_set('Asia/Shanghai');

// Escape the search term to prevent SQL injection if it's present
$searchCondition = '';
if ($searchTerm && trim($searchTerm) !== '') {
    $searchTerm = $conn->real_escape_string($searchTerm);
    switch ($logType) {
        case 'student':
            $searchCondition = " AND (s.surname LIKE '%$searchTerm%' OR s.first_name LIKE '%$searchTerm%' OR s.student_number LIKE '%$searchTerm%')";
            break;
        case 'faculty':
            $searchCondition = " AND (f.surname LIKE '%$searchTerm%' OR f.first_name LIKE '%$searchTerm%' OR f.emp_number LIKE '%$searchTerm%')";
            break;
        case 'visitor':
            $searchCondition = " AND (v.surname LIKE '%$searchTerm%' OR v.first_name LIKE '%$searchTerm%' OR v.identifier LIKE '%$searchTerm%')";
            break;
    }
}

// Add search condition to queries if needed
switch ($logType) {
    case 'student':
        $query = "SELECT s.student_number, CONCAT(s.surname, ', ', s.first_name) as name, t.time_in, t.time_out, c.course_abbreviation AS course 
                  FROM students s 
                  JOIN time_log t ON s.user_id = t.user_id 
                  LEFT JOIN courses c ON s.course_id = c.id
                  WHERE 1=1 $whereClause $searchCondition
                  ORDER BY t.time_in DESC
                  LIMIT ? OFFSET ?";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM students s 
                       JOIN time_log t ON s.user_id = t.user_id
                       LEFT JOIN courses c ON s.course_id = c.id
                       WHERE 1=1 $whereClause $searchCondition";
        break;
    case 'faculty':
        $query = "SELECT f.emp_number as faculty_code, CONCAT(f.surname, ', ', f.first_name) as name, t.time_in, t.time_out, d.dept_abbreviation AS department
                  FROM faculty f 
                  JOIN time_log t ON f.user_id = t.user_id 
                  LEFT JOIN departments d ON f.dept_id = d.id
                  WHERE 1=1 $whereClause $searchCondition
                  ORDER BY t.time_in DESC
                  LIMIT ? OFFSET ?";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM faculty f 
                       JOIN time_log t ON f.user_id = t.user_id
                       LEFT JOIN departments d ON f.dept_id = d.id
                       WHERE 1=1 $whereClause $searchCondition";
        break;
    case 'visitor':
        $query = "SELECT CONCAT(v.surname, ', ', v.first_name) as name, v.school, t.time_in, t.time_out 
                  FROM visitor v 
                  JOIN time_log t ON v.user_id = t.user_id 
                  WHERE 1=1 $whereClause $searchCondition
                  ORDER BY t.time_in DESC
                  LIMIT ? OFFSET ?";
        $countQuery = "SELECT COUNT(*) as total 
                       FROM visitor v 
                       JOIN time_log t ON v.user_id = t.user_id
                       WHERE 1=1 $whereClause $searchCondition";
        break;
    default:
        echo json_encode(['records' => [], 'totalPages' => 0]);
        exit;
}

// Execute the query and fetch results
$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(['error' => 'Error preparing statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param('ii', $itemsPerPage, $offset);
$stmt->execute();
$result = $stmt->get_result();
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

// Fetch total records for pagination
$totalResult = $conn->query($countQuery);
if ($totalResult === false) {
    echo json_encode(['error' => 'Error executing count query: ' . $conn->error]);
    exit;
}
$totalRecords = $totalResult->fetch_assoc()['total'];
$totalPages = ceil($totalRecords / $itemsPerPage);

echo json_encode(['records' => $logs, 'totalPages' => $totalPages]);
$conn->close();
?>
