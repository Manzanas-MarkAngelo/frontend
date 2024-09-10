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

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = ($page - 1) * $limit;
$search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : '%';
$category = isset($_GET['category']) ? $_GET['category'] : '';
$sortField = isset($_GET['sortField']) ? $_GET['sortField'] : 'date_added';
$sortOrder = isset($_GET['sortOrder']) ? $_GET['sortOrder'] : 'DESC';

$allowedSortFields = ['title', 'author', 'subj', 'copyright', 'callno', 'status', 'date_added', 'categoryid'];
if (!in_array($sortField, $allowedSortFields)) {
    $sortField = 'date_added';
}

$allowedSortOrders = ['ASC', 'DESC'];
if (!in_array(strtoupper($sortOrder), $allowedSortOrders)) {
    $sortOrder = 'DESC';
}

// Base SQL query
$sql = "SELECT m.id, m.accnum, m.title, m.author, m.subj, m.copyright, m.callno, m.status, m.isbn, m.date_added, c.mat_type 
        FROM materials m
        LEFT JOIN category c ON m.categoryid = c.cat_id
        WHERE (m.accnum LIKE ? OR m.title LIKE ? OR m.author LIKE ? OR m.subj LIKE ? OR m.copyright LIKE ? OR m.callno LIKE ? OR m.status LIKE ?)";

// Add category filter if provided
if (!empty($category)) {
    $sql .= " AND m.accnum LIKE ?";
}

// Add sorting logic
if ($sortField === 'categoryid') {
    // Sort by mat_type first, then by primary key id
    $sql .= " ORDER BY c.mat_type $sortOrder, m.id $sortOrder";
} else {
    // Sort by other fields
    $sql .= " ORDER BY $sortField $sortOrder";
}

// Add pagination
$sql .= " LIMIT ? OFFSET ?";

// Prepare and execute the query
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
}

// Bind parameters
$params = [$search, $search, $search, $search, $search, $search, $search];
if (!empty($category)) {
    $params[] = '%' . $category . '%';
}
$types = str_repeat('s', count($params));
$bindParams = array_merge($params, [$limit, $offset]);
$types .= 'ii';
$stmt->bind_param($types, ...$bindParams);

$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    die('Execute failed: ' . htmlspecialchars($stmt->error));
}

$materials = array();
while ($row = $result->fetch_assoc()) {
    $materials[] = $row;
}

// Get total count
$total_sql = "SELECT COUNT(*) as count FROM materials m
              LEFT JOIN category c ON m.categoryid = c.cat_id
              WHERE (m.accnum LIKE ? OR m.title LIKE ? OR m.author LIKE ? OR m.subj LIKE ? OR m.copyright LIKE ? OR m.callno LIKE ? OR m.status LIKE ?)";

$total_params = [$search, $search, $search, $search, $search, $search, $search];
if (!empty($category)) {
    $total_sql .= " AND m.accnum LIKE ?";
    $total_params[] = '%' . $category . '%';
}
$total_types = str_repeat('s', count($total_params));

$total_stmt = $conn->prepare($total_sql);
if (!$total_stmt) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
}

$total_stmt->bind_param($total_types, ...$total_params);

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
