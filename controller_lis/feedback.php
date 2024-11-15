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

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'getQuestions') {
    $result = $conn->query("SELECT id, question_text FROM questions");
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    echo json_encode($questions);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$userId = $data['userId'] ?? null;
$userType = $data['userType'] ?? null;
$responses = $data['responses'] ?? null;

if (!$userId || !$userType || !$responses) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

switch ($userType) {
    case 'student':
        $query = "SELECT user_id FROM students WHERE student_number = ?";
        break;
    case 'faculty':
        $query = "SELECT user_id FROM faculty WHERE emp_number = ?";
        break;
    case 'employee':
        $query = "SELECT user_id FROM pupt_employees WHERE emp_num = ?";
        break;
    case 'visitor':
        $query = "SELECT user_id FROM visitor WHERE identifier = ?";
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid user type']);
        exit;
}

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $userId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(['status' => 'error', 'message' => 'User ID not registered']);
    $stmt->close();
    exit;
}
$stmt->close();

$conn->begin_transaction();

try {
    $updateCount = 0;

    foreach ($responses as $questionNumber => $responseValue) {
        $questionId = intval(substr($questionNumber, 1));

        $stmt = $conn->prepare(
            "SELECT id FROM feedback_responses WHERE user_id = ? AND user_type = ? AND question_id = ?"
        );
        $stmt->bind_param("ssi", $userId, $userType, $questionId);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->close();
            $stmt = $conn->prepare(
                "UPDATE feedback_responses SET response = ?, updated_at = NOW() WHERE user_id = ? AND user_type = ? AND question_id = ?"
            );
            $stmt->bind_param("issi", $responseValue, $userId, $userType, $questionId);
            $stmt->execute();
            $updateCount++;
        } else {
            $stmt->close();
            $stmt = $conn->prepare(
                "INSERT INTO feedback_responses (user_id, user_type, question_id, response, created_at, updated_at)
                VALUES (?, ?, ?, ?, NOW(), NOW())"
            );
            $stmt->bind_param("ssii", $userId, $userType, $questionId, $responseValue);
            $stmt->execute();
        }
        $stmt->close();
    }    

    $conn->commit();

    if ($updateCount > 0) {
        echo json_encode(['status' => 'updated', 'message' => 'Your feedback has been updated']);
    } else {
        echo json_encode(['status' => 'success', 'message' => 'Feedback submitted successfully']);
    }
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => 'Failed to submit feedback']);
}
$conn->close();
?>