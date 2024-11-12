<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get questionNumber parameter from the request
$questionNumber = isset($_GET['questionNumber']) ? $_GET['questionNumber'] : null;

if (!$questionNumber) {
    echo json_encode(["error" => "Question number is required"]);
    http_response_code(400);
    exit;
}

// Fetch the question text from the questions table based on questionNumber
$questionText = null;
$questionQuery = "SELECT question_text FROM questions WHERE id = ?";
$questionStmt = $conn->prepare($questionQuery);
$questionStmt->bind_param("i", $questionNumber);
$questionStmt->execute();
$questionResult = $questionStmt->get_result();

if ($questionResult->num_rows > 0) {
    $questionRow = $questionResult->fetch_assoc();
    $questionText = $questionRow['question_text'];
} else {
    echo json_encode(["error" => "Question not found"]);
    http_response_code(404);
    exit;
}

// Query to count occurrences of each response (1 to 5) for the specified questionNumber
$sql = "
    SELECT response, COUNT(*) as count
    FROM feedback_responses
    WHERE question_id = ?
    AND response IN (1, 2, 3, 4, 5)
    GROUP BY response
    ORDER BY response ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $questionNumber);
$stmt->execute();
$result = $stmt->get_result();

$responsesCount = [
    "Very_Unsatisfied" => 0,
    "Unsatisfied" => 0,
    "Neutral" => 0,
    "Satisfied" => 0,
    "Very_Satisfied" => 0,
];

// Map numeric responses to named keys
$responseMap = [
    1 => "Very_Unsatisfied",
    2 => "Unsatisfied",
    3 => "Neutral",
    4 => "Satisfied",
    5 => "Very_Satisfied"
];

// Fetch and store the counts in the renamed response array
while ($row = $result->fetch_assoc()) {
    $responseKey = $responseMap[$row['response']];
    $responsesCount[$responseKey] = (int)$row['count'];
}

// Prepare the final response with question text and response counts
$responseData = [
    "question" => $questionText,
    "responses" => $responsesCount
];

echo json_encode($responseData);

// Close the connections
$stmt->close();
$questionStmt->close();
$conn->close();
?>
