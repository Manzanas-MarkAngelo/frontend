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
$remarkFilter = isset($_GET['remark']) ? $_GET['remark'] : null;

// Base SQL query to fetch data including subject name (subj)
$sql = "
SELECT 
    b.material_id,
    b.claim_date,
    b.due_date,
    b.return_date,
    b.remark,
    m.title,
    m.author,
    m.subj as subject_name,  -- Adding subject_name
    u.user_type,
    IF(u.user_type = 'student', s.first_name, IF(u.user_type = 'faculty', f.first_name, e.first_name)) as first_name,
    IF(u.user_type = 'student', s.surname, IF(u.user_type = 'faculty', f.surname, e.surname)) as surname,
    IF(u.user_type = 'student', c.course_abbreviation, IF(u.user_type = 'faculty', d.dept_abbreviation, 'Employee')) as course_department
FROM 
    borrowing b
    JOIN materials m ON b.material_id = m.id
    JOIN users u ON b.user_id = u.id
    LEFT JOIN students s ON u.id = s.user_id
    LEFT JOIN faculty f ON u.id = f.user_id
    LEFT JOIN pupt_employees e ON u.id = e.user_id  -- Added join for pupt_employees
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN departments d ON f.dept_id = d.id
WHERE 1 = 1  -- Always true to make adding conditions easier
";

// Add search term filtering if a search term is provided
if (!empty($searchTerm)) {
    $searchTerm = $conn->real_escape_string($searchTerm); // Sanitize input
    $sql .= " AND (
        m.title LIKE '%$searchTerm%' 
        OR m.author LIKE '%$searchTerm%' 
        OR m.subj LIKE '%$searchTerm%'  -- Add subject_name to the search filter
        OR b.remark LIKE '%$searchTerm%' 
        OR s.first_name LIKE '%$searchTerm%' 
        OR s.surname LIKE '%$searchTerm%' 
        OR f.first_name LIKE '%$searchTerm%' 
        OR f.surname LIKE '%$searchTerm%'
        OR e.first_name LIKE '%$searchTerm%'
        OR e.surname LIKE '%$searchTerm%'
    )";
}

// Add remark filtering if a remark filter is provided
if (!empty($remarkFilter)) {
    $remarkFilter = $conn->real_escape_string($remarkFilter); // Sanitize input
    $sql .= " AND b.remark = '$remarkFilter'";
}

// Add date range filtering if both start and end dates are provided
if ($startDate && $endDate) {
    $sql .= " AND b.claim_date BETWEEN '$startDate' AND '$endDate'";
}

// Order by non-returned items first, then by claim date or return date
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

// Return the results as JSON including subject_name
echo json_encode($borrowings);

$conn->close();
?>
