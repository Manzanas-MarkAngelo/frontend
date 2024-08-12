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
$category = $data['category'] ?? null;
$author = $data['author'] ?? null;
$callno = $data['callnum'] ?? null;
$copyright = $data['copyright'] ?? null;
$publisher = $data['publisher'] ?? null;
$edition = $data['edition'] ?? null;
$isbn = $data['isbn'] ?? null;
$status = $data['status'] ?? null;
$heading = $data['heading'] ?? null;
$datereceived = date('Y-m-d'); // set the current date
$subj = $heading;
// Define the category ID mapping
$categoryMap = [
    'Filipiñana' => 20,
    'Circulation' => 21,
    'Fiction' => 22,
    'Reference' => 23,
    'Thesis/Dissertations' => 26,
    'Feasibility' => 27,
    'Donations' => 28,
    'E-Book' => 29,
    'PDF' => 30,
    'Business Plan' => 31,
    'Case Study' => 32,
    'Training Manual' => 33,
    'OJT/Internship' => 34
];

// Assign category ID based on the selected category
$categoryid = $categoryMap[$category] ?? 0; // Default to 0 if category is not found

$conn->begin_transaction();

try {
    // Insert book details into the materials table
    $stmt = $conn->prepare("INSERT INTO materials (
        accnum, isbn, datereceived, title, subj, callno, author, 
        publisher, edition, copyright, copies, categoryid, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $copies = 1; // Assuming a default value for copies, adjust as needed

    $stmt->bind_param("sssssssssssis", 
        $accnum, $isbn, $datereceived, $title, $subj, $callno, 
        $author, $publisher, $edition, $copyright, $copies, $categoryid, $status);

    $stmt->execute();
    $stmt->close();

    // Increment the counter column in the category table
    $stmt = $conn->prepare("UPDATE category SET counter = counter + 1 WHERE mat_type = ?");
    $stmt->bind_param("s", $category);
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
