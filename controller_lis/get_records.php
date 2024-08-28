<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Initialize variables
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$recordType = $data['recordType'] ?? '';
$itemsPerPage = $data['itemsPerPage'] ?? 13;
$page = $data['page'] ?? 1;
$offset = ($page - 1) * $itemsPerPage;
$user_id = $data['user_id'] ?? ''; // Fetch user_id from JSON data

// Error handling for invalid JSON input
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

// Determine the response based on recordType and user_id
if ($recordType === 'student' && $user_id) {
    // Fetch details for a single student
    $query = "SELECT s.student_number, s.first_name, s.surname, s.gender, c.course_abbreviation AS course, s.phone_number
              FROM students s
              LEFT JOIN courses c ON s.course_id = c.id
              WHERE s.user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(['error' => 'Student not found']);
    }
    
    $stmt->close();
} elseif ($recordType === 'visitor' && $user_id) {
    // Fetch details for a single visitor
    $query = "SELECT user_id, first_name, surname, gender, phone_number, school, identifier 
              FROM visitor 
              WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(['error' => 'Visitor not found']);
    }
    
    $stmt->close();
} elseif ($user_id) {
    // Fetch details for a single faculty
    $query = "SELECT f.user_id, f.emp_number, f.first_name, f.surname, f.gender, d.dept_abbreviation AS department, f.phone_number 
              FROM faculty f
              LEFT JOIN departments d ON f.dept_id = d.id
              WHERE f.user_id = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        echo json_encode(['error' => 'Error preparing statement: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $record = $result->fetch_assoc();
        echo json_encode($record);
    } else {
        echo json_encode(['error' => 'No record found']);
    }
    $stmt->close();
} else {
    // Fetch list of records based on recordType
    switch ($recordType) {
        case 'student':
            $query = "SELECT s.student_number, CONCAT(s.surname, ', ', s.first_name) as name, s.gender, c.course_abbreviation AS course, s.phone_number, s.user_id
                      FROM students s
                      LEFT JOIN courses c ON s.course_id = c.id
                      ORDER BY s.created_at DESC
                      LIMIT $itemsPerPage 
                      OFFSET $offset";
            $countQuery = "SELECT COUNT(*) as total FROM students";
            break;
        case 'faculty':
            $query = "SELECT f.user_id, f.emp_number, CONCAT(f.surname, ', ', f.first_name) as name, f.gender, d.dept_abbreviation AS department, f.phone_number 
                      FROM faculty f
                      LEFT JOIN departments d ON f.dept_id = d.id
                      ORDER BY f.created_at DESC
                      LIMIT $itemsPerPage 
                      OFFSET $offset";
            $countQuery = "SELECT COUNT(*) as total FROM faculty";
            break;
        case 'visitor':
            $query = "SELECT CONCAT(surname, ', ', first_name) as name, gender, phone_number, school, identifier, user_id
                      FROM visitor 
                      ORDER BY created_at DESC
                      LIMIT $itemsPerPage 
                      OFFSET $offset";
            $countQuery = "SELECT COUNT(*) as total FROM visitor";
            break;
        default:
            $query = "SELECT s.student_number, CONCAT(s.surname, ', ', s.first_name) as name, s.gender, c.course_abbreviation AS course, s.phone_number 
                      FROM students s
                      LEFT JOIN courses c ON s.course_id = c.id
                      ORDER BY s.created_at DESC
                      LIMIT $itemsPerPage 
                      OFFSET $offset";
            $countQuery = "SELECT COUNT(*) as total FROM students";
    }

    $result = $conn->query($query);
    if ($result === false) {
        echo json_encode(['error' => 'Error executing query: ' . $conn->error]);
        exit;
    }

    $records = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
    }

    // Calculate total pages for pagination
    $totalResult = $conn->query($countQuery);
    if ($totalResult === false) {
        echo json_encode(['error' => 'Error executing count query: ' . $conn->error]);
        exit;
    }
    $totalRecords = $totalResult->fetch_assoc()['total'];
    $totalPages = ceil($totalRecords / $itemsPerPage);

    echo json_encode(['records' => $records, 'totalPages' => $totalPages]);
}

$conn->close();
?>