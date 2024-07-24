<?php
include 'db_connection.php'; // Including the connection file

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight requests
    http_response_code(200);
    exit;
}

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = ($page - 1) * $limit;
$search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : '%';

$sql = "SELECT accnum, title, author, subj, copyright, callno, status 
        FROM materials 
        WHERE accnum LIKE ? OR title LIKE ? OR author LIKE ? OR subj 
            LIKE ? OR copyright LIKE ? OR callno LIKE ? OR status LIKE ? 
        LIMIT ? OFFSET ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssii", $search, $search, $search, $search, $search, 
    $search, $search, $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$materials = array();
while ($row = $result->fetch_assoc()) {
    $materials[] = $row;
}

$total_sql = "SELECT COUNT(*) as count FROM materials 
              WHERE accnum LIKE ? OR title LIKE ? OR author LIKE ? OR subj 
                  LIKE ? OR copyright LIKE ? OR callno LIKE ? OR status LIKE ?";
$total_stmt = $conn->prepare($total_sql);
$total_stmt->bind_param("sssssss", $search, $search, $search, 
    $search, $search, $search, $search);
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
