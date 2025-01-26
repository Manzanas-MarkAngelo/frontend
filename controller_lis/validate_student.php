<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the data passed in the POST request
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Extract the student details from the input
    $studentLname = $data['studentLname'];
    $studentNo = $data['studentNo'];

    // Check if both parameters are provided
    if (empty($studentLname) || empty($studentNo)) {
        echo json_encode(["success" => false, "message" => "Last name and student number are required."]);
        exit;
    }

    // SQL query to check if a record exists with the given student number and last name
    $sql = "SELECT * FROM student_checker WHERE studentNo = ? AND studentLname = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $studentNo, $studentLname);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the query returned any results
    if ($result->num_rows > 0) {
        // Matching record found
        echo json_encode(["success" => true, "message" => "Student found"]);
    } else {
        // No matching record found
        echo json_encode(["success" => false, "message" => "No matching student found"]);
    }

    // Close the statement
    $stmt->close();
}

// Close the database connection
$conn->close();
?>
