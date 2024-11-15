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

$title = $data['title'] ?? null;
$accnum = $data['accnum'] ?? null;
$categoryid = $data['category'] ?? null;
$author = $data['author'] ?? null;
$callno = $data['callnum'] ?? null;
$copyright = $data['copyright'] ?? null;
$publisher = $data['publisher'] ?? null;
$edition = $data['edition'] ?? null;
$isbn = $data['isbn'] ?? null;
$status = $data['status'] ?? null;
$heading = $data['heading'] ?? null;

$subj = $heading; // Subject value from heading

$conn->begin_transaction();

try {
    // Insert book details into the materials table
    $stmt = $conn->prepare("INSERT INTO materials (
        accnum, isbn, title, subj, callno, author, 
        publisher, edition, copyright, copies, categoryid, status, subject_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $copies = 1; // Assuming a default value for copies, adjust as needed

    // Include $heading as subject_id in the bind_param
    $stmt->bind_param("ssssssssssiss", 
    $accnum, $isbn, $title, $subj, $callno, 
    $author, $publisher, $edition, $copyright, $copies, $categoryid, $status, $heading); // Add $heading as the last parameter

    $stmt->execute();
    $stmt->close();

    // Increment the counter column in the category table
    $stmt = $conn->prepare("UPDATE category SET counter = counter + 1 WHERE cat_id = ?");
    $stmt->bind_param("s", $categoryid);
    $stmt->execute();
    $stmt->close();

    $conn->commit();

    echo json_encode(['status' => 'success', 'message' => 'Book added and category counter updated successfully']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
$conn->close();
?>
