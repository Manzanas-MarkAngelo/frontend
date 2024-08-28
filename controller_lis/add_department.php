<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['dept_program']) && isset($data['dept_abbreviation'])) {
    $dept_program = $data['dept_program'];
    $dept_abbreviation = $data['dept_abbreviation'];

    $stmt = $conn->prepare("INSERT INTO departments (dept_program, dept_abbreviation) VALUES (?, ?)");
    $stmt->bind_param("ss", $dept_program, $dept_abbreviation);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add department']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
?>