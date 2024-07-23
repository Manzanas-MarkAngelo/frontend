<?php
include 'db_connection.php'; // Including the connection file

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight requests
    http_response_code(200);
    exit;
}

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

$selectedRole = $data['selectedRole'];
$studentNumber = isset($data['studentNumber']) ? $data['studentNumber'] : null;
$sex = $data['sex'];
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$department = isset($data['department']) ? $data['department'] : null;
$school = isset($data['school']) ? $data['school'] : null;
$course = $data['course'];
$contact = $data['contact'];
$empNumber = isset($data['empNumber']) ? $data['empNumber'] : null;
$middleName = isset($data['middleName']) ? $data['middleName'] : null;

// Start transaction
$conn->begin_transaction();

try {
    // Insert into users table
    $stmt = $conn->prepare("INSERT INTO users (user_type, created_at, updated_at) 
        VALUES (?, NOW(), NOW())");
    $stmt->bind_param("s", $selectedRole);
    $stmt->execute();
    $userId = $stmt->insert_id;
    $stmt->close();

    if ($selectedRole == 'student') {
        // Insert into students table
        $stmt = $conn->prepare("INSERT INTO students (user_id, student_number, 
                first_name, surname, gender, phone_number, course, 
                created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

        $stmt->bind_param("issssss", $userId, $studentNumber, $firstName, 
                $lastName, $sex, $contact, $course);
    } elseif ($selectedRole == 'faculty') {
        // Insert into faculty table
        if ($empNumber === null) {
            throw new Exception('Employee number is required for faculty');
        }
        $stmt = $conn->prepare("INSERT INTO faculty (user_id, emp_number, 
                first_name, surname, gender, phone_number, course, created_at, 
                updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

        $stmt->bind_param("issssss", $userId, $empNumber, $firstName, 
            $lastName, $sex, $contact, $course);
    } elseif ($selectedRole == 'visitor') {
        // Insert into visitors table
        $stmt = $conn->prepare("INSERT INTO visitor (user_id, first_name, 
                middle_name, surname, gender, phone_number, course, 
                created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->bind_param("issssss", $userId, $firstName, $middleName, 
            $lastName, $sex, $contact, $course);
    } else {
        throw new Exception('Invalid role selected');
    }

    $stmt->execute();
    $stmt->close();

    // Commit transaction
    $conn->commit();

    echo json_encode(['status' => 'success', 'message' => 
        'User registered successfully']);
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
