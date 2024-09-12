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

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? null;
$title = $data['title'] ?? null;
$heading = $data['subj'] ?? null;
$accnum = $data['accnum'] ?? null;
$category = $data['category'] ?? null;
$categoryid = $data['category'] ?? null;
$author = $data['author'] ?? null;
$callnum = $data['callno'] ?? null;
$copyright = $data['copyright'] ?? null;
$publisher = $data['publisher'] ?? null;
$edition = $data['edition'] ?? null;
$isbn = $data['isbn'] ?? null;
$status = $data['status'] ?? null;

// Fetch the category ID dynamically based on mat_type
$stmt = $conn->prepare("SELECT cat_id FROM category WHERE mat_type = ?");
$stmt->bind_param("s", $category);
$stmt->execute();
$stmt->bind_result($categoryid);
$stmt->fetch();
$stmt->close();

// If category ID is not found, set it to 0 (or handle as needed)
//$categoryid = $categoryid ?? 0;

$conn->begin_transaction();

try {
    // Update book details in the materials table
    $stmt = $conn->prepare("UPDATE materials SET
        title = ?, subj = ?, accnum = ?, categoryid = ?, author = ?, 
        callno = ?, copyright = ?, publisher = ?, edition = ?, 
        isbn = ?, status = ?
        WHERE id = ?");
    
    $stmt->bind_param("sssisssssssi", 
        $title, $heading, $accnum, $categoryid, $author, 
        $callnum, $copyright, $publisher, $edition, 
        $isbn, $status, $id);

    $stmt->execute();
    $stmt->close();

    $conn->commit();

    echo json_encode(['status' => 'success', 'message' => 'Book details updated successfully']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
$conn->close();
?>
