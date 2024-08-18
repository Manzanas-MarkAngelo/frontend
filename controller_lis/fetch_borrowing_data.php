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

$sql = "
SELECT 
    b.material_id,
    b.claim_date,
    b.due_date,
    b.remark,
    m.title,
    m.author,
    u.user_type,
    IF(u.user_type = 'student', s.first_name, f.first_name) as first_name,
    IF(u.user_type = 'student', s.surname, f.surname) as surname,
    IF(u.user_type = 'student', s.course, f.department) as course_department
FROM 
    borrowing b
    JOIN materials m ON b.material_id = m.id
    JOIN users u ON b.user_id = u.id
    LEFT JOIN students s ON u.id = s.user_id
    LEFT JOIN faculty f ON u.id = f.user_id";

if ($startDate && $endDate) {
    $sql .= " WHERE b.claim_date BETWEEN '$startDate' AND '$endDate'";
}

$sql .= " ORDER BY b.claim_date DESC";

$result = $conn->query($sql);
$borrowings = array();

while ($row = $result->fetch_assoc()) {
    $borrowings[] = $row;
}

echo json_encode($borrowings);

$conn->close();
?>
