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

$startDate = isset($_GET['startDate']) ? $_GET['startDate'] : null;
$endDate = isset($_GET['endDate']) ? $_GET['endDate'] : null;
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';

$sql = "
SELECT 
    b.material_id,
    b.claim_date,
    b.due_date,
    b.return_date,
    b.remark,
    m.title,
    m.author,
    u.user_type,
    IF(u.user_type = 'student', s.first_name, f.first_name) as first_name,
    IF(u.user_type = 'student', s.surname, f.surname) as surname,
    IF(u.user_type = 'student', c.course_abbreviation, d.dept_abbreviation) as course_department
FROM 
    borrowing b
    JOIN materials m ON b.material_id = m.id
    JOIN users u ON b.user_id = u.id
    LEFT JOIN students s ON u.id = s.user_id
    LEFT JOIN faculty f ON u.id = f.user_id
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN departments d ON f.dept_id = d.id
WHERE 
    (m.title LIKE '%$searchTerm%' 
    OR m.author LIKE '%$searchTerm%' 
    OR b.remark LIKE '%$searchTerm%' 
    OR s.first_name LIKE '%$searchTerm%' 
    OR s.surname LIKE '%$searchTerm%' 
    OR f.first_name LIKE '%$searchTerm%' 
    OR f.surname LIKE '%$searchTerm%')
";

if ($startDate && $endDate) {
    $sql .= " AND b.claim_date BETWEEN '$startDate' AND '$endDate'";
}

$sql .= "
ORDER BY 
    CASE 
        WHEN b.remark IN ('Returned', 'Returned Late') THEN 2
        ELSE 1
    END ASC,  -- Non-returned books first
    CASE 
        WHEN b.remark IN ('Returned', 'Returned Late') THEN b.return_date
        ELSE b.claim_date
    END DESC";

$result = $conn->query($sql);
$borrowings = array();

while ($row = $result->fetch_assoc()) {
    $borrowings[] = $row;
}

echo json_encode($borrowings);

$conn->close();
