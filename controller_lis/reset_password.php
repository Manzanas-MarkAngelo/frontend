<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);
$newPassword = $data['password'];
$token = $data['token'];

$hashedPassword = hash('sha256', $newPassword);

$query = "SELECT email FROM password_resets WHERE token = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $email = $row['email'];

    $updateQueryAdmin = "UPDATE admin SET password = ? WHERE email = ?";
    $stmtAdmin = $conn->prepare($updateQueryAdmin);
    $stmtAdmin->bind_param("ss", $hashedPassword, $email);
    $stmtAdmin->execute();

    $updateQueryLibrarian = "UPDATE librarian SET password = ? WHERE email = ?";
    $stmtLibrarian = $conn->prepare($updateQueryLibrarian);
    $stmtLibrarian->bind_param("ss", $hashedPassword, $email);
    $stmtLibrarian->execute();

    $deleteToken = $conn->prepare("DELETE FROM password_resets WHERE token = ?");
    $deleteToken->bind_param("s", $token);
    $deleteToken->execute();

    echo json_encode(['success' => true, 'message' => 'Password reset successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid token']);
}

$conn->close();
?>