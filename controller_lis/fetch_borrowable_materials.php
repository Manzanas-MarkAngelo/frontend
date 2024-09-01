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

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check for overdue books
$currentDate = date('Y-m-d');
$sql = "UPDATE borrowing 
        SET remark = 'Overdue' 
        WHERE due_date < ? AND remark = 'In Progress'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $currentDate);
$stmt->execute();

// Now proceed with fetching the borrowable materials
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 13;
$offset = ($page - 1) * $limit;
$search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : '%';
$category = isset($_GET['category']) ? $_GET['category'] : '';

$sql = "SELECT m.id, m.accnum, m.title, m.author, m.subj, 
               m.copyright, m.callno, m.status, m.isbn 
        FROM materials m
        JOIN category c ON m.categoryid = c.cat_id
        WHERE c.cat_type = 'Normal' AND c.duration > 0 
        AND (m.accnum LIKE ? 
             OR m.title LIKE ? 
             OR m.author LIKE ? 
             OR m.subj LIKE ? 
             OR m.copyright LIKE ? 
             OR m.callno LIKE ? 
             OR m.status LIKE ?)";

if (!empty($category)) {
    $sql .= " AND m.accnum LIKE ?";
    $category = '%' . $category . '%';
}

// Add ordering by date_added and mat_type
$sql .= " ORDER BY m.date_added DESC, c.mat_type ASC
          LIMIT ? OFFSET ?";
$stmt = $conn->prepare($sql);

if (!empty($category)) {
    $stmt->bind_param(
        "ssssssssii", 
        $search, $search, $search, $search, $search, 
        $search, $search, $category, $limit, $offset);
} else {
    $stmt->bind_param(
        "sssssssii", 
        $search, $search, $search, $search, $search, 
        $search, $search, $limit, $offset);
}

$stmt->execute();
$result = $stmt->get_result();

$materials = array();
while ($row = $result->fetch_assoc()) {
    $materials[] = $row;
}

$total_sql = "SELECT COUNT(*) as count 
              FROM materials m
              JOIN category c ON m.categoryid = c.cat_id
              WHERE c.cat_type = 'Normal' AND c.duration > 0
              AND (m.accnum LIKE ? 
                   OR m.title LIKE ? 
                   OR m.author LIKE ? 
                   OR m.subj LIKE ? 
                   OR m.copyright LIKE ? 
                   OR m.callno LIKE ? 
                   OR m.status LIKE ?)";

if (!empty($category)) {
    $total_sql .= " AND m.accnum LIKE ?";
}

$total_stmt = $conn->prepare($total_sql);

if (!empty($category)) {
    $total_stmt->bind_param(
        "ssssssss", 
        $search, $search, $search, $search, $search, $search, $search, $category);
} else {
    $total_stmt->bind_param(
        "sssssss", $search, $search, $search, $search, $search, $search, $search);
}

$total_stmt->execute();
$total_result = $total_stmt->get_result();
$total_row = $total_result->fetch_assoc();
$total_items = $total_row['count'];

$response = array(
    'data' => $materials,
    'totalItems' => $total_items,
    'currentPage' => $page,
    'totalPages' => ceil($total_items / $limit)
);

echo json_encode($response);

$stmt->close();
$total_stmt->close();
$conn->close();
?>
