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

$username = $data['username'];
$password = $data['password'];

$librarianQuery = "SELECT * FROM librarian WHERE username = ? AND password = SHA2(?, 256)";
$adminQuery = "SELECT * FROM admin WHERE username = ? AND password = SHA2(?, 256)";

if ($stmt = $conn->prepare($librarianQuery)) {
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $librarianResult = $stmt->get_result();

    if ($librarianResult->num_rows > 0) {
        echo json_encode(['success' => true, 'role' => 'librarian']);
        $stmt->close();
        $conn->close();
        exit;
    }
}

if ($stmt = $conn->prepare($adminQuery)) {
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $adminResult = $stmt->get_result();

    if ($adminResult->num_rows > 0) {
        echo json_encode(['success' => true, 'role' => 'admin']);
        $stmt->close();
        $conn->close();
        exit;
    }
}

echo json_encode(['success' => false]);
$stmt->close();
$conn->close();
?>