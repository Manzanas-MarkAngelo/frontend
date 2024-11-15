<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$material_id = $data['material_id'] ?? null;

if ($material_id) {
    $librarian_sql = "SELECT name FROM librarian ORDER BY id DESC LIMIT 1";
    $librarian_result = $conn->query($librarian_sql);
    $librarian_name = $librarian_result->num_rows > 0 ? $librarian_result->fetch_assoc()['name'] : 'Unknown Librarian';

    $sql = "SELECT b.*, m.title, m.author, u.user_type, 
            IF(u.user_type = 'student', s.first_name, IF(u.user_type = 'faculty', f.first_name, e.first_name)) as first_name,
            IF(u.user_type = 'student', s.surname, IF(u.user_type = 'faculty', f.surname, e.surname)) as surname,
            IF(u.user_type = 'student', c.course_abbreviation, IF(u.user_type = 'faculty', d.dept_abbreviation, 'Employee')) as course_department,
            IF(u.user_type = 'student', s.student_number, IF(u.user_type = 'faculty', f.emp_number, e.emp_num)) as borrower_id
            FROM borrowing b
            JOIN materials m ON b.material_id = m.id
            JOIN users u ON b.user_id = u.id
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN faculty f ON u.id = f.user_id
            LEFT JOIN pupt_employees e ON u.id = e.user_id
            LEFT JOIN courses c ON s.course_id = c.id
            LEFT JOIN departments d ON f.dept_id = d.id
            WHERE b.material_id = ?
            ORDER BY b.claim_date DESC LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $material_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $due_date = new DateTime($row['due_date']);
        $return_date = new DateTime($row['return_date'] ?? 'now');
        $days_late = max($due_date->diff($return_date)->days, 0);

        $amount_due = $days_late * 10;

        if ($days_late === 0) {
            $amount_due = 0;
        }
    
        echo json_encode([
            'status' => 'success',
            'days_late' => $days_late,
            'amount_due' => $amount_due,
            'first_name' => $row['first_name'],
            'surname' => $row['surname'],
            'borrower_id' => $row['borrower_id'],
            'title' => $row['title'],
            'author' => $row['author'],
            'date_borrowed' => $row['claim_date'],
            'due_date' => $row['due_date'],
            'course_department' => $row['course_department'],
            'librarian_name' => $librarian_name,
            'user_type' => $row['user_type']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Material ID not found or not overdue.']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid material ID.']);
}

$conn->close();
?>