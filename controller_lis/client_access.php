<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight request response
    http_response_code(200);
    exit;
}

// Retrieve POST data
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Check if username and password are provided
if (empty($username) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Username and password required']);
    exit;
}

// Query to check the librarian's credentials
$sql = "SELECT password FROM librarian WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    // Verify the password using SHA2 hash comparison
    // Hash the password entered by the user with SHA2 (256)
    $hashed_input_password = hash('sha256', $password);

    // Compare the stored hash with the input hash
    if (hash_equals($hashed_input_password, $hashed_password)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

$stmt->close();
$conn->close();
