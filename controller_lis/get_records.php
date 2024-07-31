<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$recordType = $data['recordType'] ?? '';

switch ($recordType) {
    case 'student':
        $query = "SELECT student_number, CONCAT(surname, ', ', first_name) as name, gender, course, phone_number FROM students";
        break;
    case 'faculty':
        $query = "SELECT emp_number as emp_number, CONCAT(surname, ', ', first_name) as name, gender, department, phone_number FROM faculty";
        break;
    case 'visitor':
        $query = "SELECT CONCAT(surname, ', ', first_name) as name, gender, phone_number, school FROM visitor";
        break;
    default:
        $query = "SELECT student_number, CONCAT(surname, ', ', first_name) as name, gender, course, phone_number FROM students";
}

$result = $conn->query($query);
$records = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
}

echo json_encode($records);
$conn->close();
?>