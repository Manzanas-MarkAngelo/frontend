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

$accnum = isset($_GET['accnum']) ? $_GET['accnum'] : '';

if ($accnum) {
    $sql = "SELECT * FROM materials WHERE accnum = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $accnum);
    $stmt->execute();
    $result = $stmt->get_result();
    $material = $result->fetch_assoc();

    echo json_encode($material);
} else {
    echo json_encode(['error' => 'Invalid Accession Number']);
}

$stmt->close();
$conn->close();
?>
