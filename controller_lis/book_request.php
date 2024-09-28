<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents('php://input'), true);

$title = $data['title'] ?? null;
$author = $data['author'] ?? null;
$year_published = $data['year_published'] ?? null;
$requester_id = $data['requester_id'] ?? null;
$requester_type = $data['requester_type'] ?? null;

if (
    $title === null || 
    $author === null || 
    $year_published === null || 
    $requester_id === null || 
    $requester_type === null
) {
    echo json_encode([
        'success' => false, 
        'message' => 'Missing required fields'
    ]);
    exit();
}

function getRequesterName($conn, $requester_type, $requester_id) {
    if ($requester_type === 'student') {
        $query = "SELECT CONCAT(first_name, ' ', surname) as full_name FROM students WHERE student_number = ?";
    } elseif ($requester_type === 'faculty') {
        $query = "SELECT CONCAT(first_name, ' ', surname) as full_name FROM faculty WHERE emp_number = ?";
    } elseif ($requester_type === 'visitor') {
        $query = "SELECT CONCAT(first_name, ' ', surname) as full_name FROM visitor WHERE identifier = ?";
    } else {
        return null;
    }

    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $requester_id);
    $stmt->execute();
    $stmt->bind_result($full_name);
    $stmt->fetch();

    return $full_name ?? 'Unknown';
}

$requester_name = getRequesterName($conn, $requester_type, $requester_id);

if ($requester_name === 'Unknown') {
    echo json_encode([
        'success' => false, 
        'message' => 'Requestor not found.'
    ]);
    exit();
}

$query = "INSERT INTO request (title, author, year_published, requester_type, requester_name, requester_id) 
          VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

if ($stmt === false) {
    echo json_encode([
        'success' => false, 
        'message' => 'Error preparing statement'
    ]);
    exit();
}

$stmt->bind_param(
    "ssssss", 
    $title, 
    $author, 
    $year_published, 
    $requester_type, 
    $requester_name, 
    $requester_id
);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'message' => 'Book request submitted successfully'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to submit book request'
    ]);
}

$stmt->close();
$conn->close();
?>