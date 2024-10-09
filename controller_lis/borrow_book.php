<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id_number = $data['id_number'];
$material_id = $data['material_id'];

$sql = "SELECT user_id FROM students WHERE student_number = ? 
        UNION SELECT user_id FROM faculty WHERE emp_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $id_number, $id_number);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['status' => 'error', 'message' => 'User ID not found.']);
    exit;
}

$user_id = $user['user_id'];

$sql = "SELECT m.id, m.status, c.duration 
        FROM materials m 
        INNER JOIN category c ON m.categoryid = c.cat_id 
        WHERE m.id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $material_id);
$stmt->execute();
$result = $stmt->get_result();
$material = $result->fetch_assoc();

if ($material['status'] === 'Available') {
    $due_date = date('Y-m-d', strtotime('+' . $material['duration'] . ' days'));

    $sql = "INSERT INTO borrowing (user_id, material_id, claim_date, due_date, remark) 
            VALUES (?, ?, CURDATE(), ?, 'In Progress')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iis", $user_id, $material_id, $due_date);
    $stmt->execute();

    $sql = "UPDATE materials SET status = 'Charged' WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $material_id);
    $stmt->execute();

    $response = array('status' => 'success', 'message' => 'Book borrowed successfully!');

    $emailData = [
        'user_id' => $user_id,
        'material_id' => $material_id
    ];

    $ch = curl_init('http://localhost/controller_lis/send_borrow_notification.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json')); 
    $emailResponse = curl_exec($ch);
    curl_close($ch);

    echo json_encode($response);
} else {
    $response = array('status' => 'error', 'message' => 'Book is not available for borrowing.');
    echo json_encode($response);
}

$stmt->close();
$conn->close();
?>