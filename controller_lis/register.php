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

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents('php://input'), true);

$selectedRole = isset($data['selectedRole']) ? $data['selectedRole'] : null;
$studentNumber = isset($data['studentNumber']) ? $data['studentNumber'] : null;
$sex = isset($data['sex']) ? $data['sex'] : null;
$firstName = isset($data['firstName']) ? $data['firstName'] : null;
$lastName = isset($data['lastName']) ? $data['lastName'] : null;
$departmentId = isset($data['department']) ? $data['department'] : null;
$school = isset($data['school']) ? $data['school'] : null;
$courseId = isset($data['courseId']) ? $data['courseId'] : null;
$contact = isset($data['contact']) ? $data['contact'] : null;
$empNumber = isset($data['empNumber']) ? $data['empNumber'] : null;
$identifier = isset($data['identifier']) ? $data['identifier'] : null;
$email = isset($data['email']) ? $data['email'] : null;

if (!$selectedRole) {
    echo json_encode(['status' => 'error', 'message' => 'Role is required']);
    exit;
}

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("INSERT INTO users (user_type, created_at, updated_at) VALUES (?, NOW(), NOW())");
    $stmt->bind_param("s", $selectedRole);
    $stmt->execute();
    $userId = $stmt->insert_id;
    $stmt->close();

    if ($selectedRole == 'student') {
        if (!$studentNumber) {
            throw new Exception('Student number is required for students');
        }
        $stmt = $conn->prepare("INSERT INTO students (user_id, student_number, first_name, surname, gender, phone_number, course_id, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->bind_param("isssssss", $userId, $studentNumber, $firstName, $lastName, $sex, $contact, $courseId, $email);
    } elseif ($selectedRole == 'faculty') {
        if (!$empNumber) {
            throw new Exception('Employee number is required for faculty');
        }
        $stmt = $conn->prepare("INSERT INTO faculty (user_id, emp_number, first_name, surname, gender, phone_number, dept_id, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->bind_param("isssssss", $userId, $empNumber, $firstName, $lastName, $sex, $contact, $departmentId, $email);
    } elseif ($selectedRole == 'visitor') {
        if (!$identifier) {
            throw new Exception('Identifier is required for visitors');
        }
        $stmt = $conn->prepare("INSERT INTO visitor (user_id, first_name, surname, gender, phone_number, school, identifier, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->bind_param("issssss", $userId, $firstName, $lastName, $sex, $contact, $school, $identifier);
    } else {
        throw new Exception('Invalid role selected');
    }

    $stmt->execute();
    $stmt->close();

    $conn->commit();

    echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
$conn->close();
?>