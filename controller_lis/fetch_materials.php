<?php
include 'db_connection.php';

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
$category = isset($_GET['category']) ? '%' . $_GET['category'] . '%' : '';
$sortField = isset($_GET['sortField']) ? $_GET['sortField'] : 'date_added';
$sortOrder = isset($_GET['sortOrder']) ? $_GET['sortOrder'] : 'DESC';

// Sanitize sort field and order
$allowedSortFields = ['title', 'author', 'subj', 'copyright', 'callno', 'status', 'date_added'];
if (!in_array($sortField, $allowedSortFields)) {
    $sortField = 'date_added'; // Fallback to default if invalid
}

$allowedSortOrders = ['ASC', 'DESC'];
if (!in_array(strtoupper($sortOrder), $allowedSortOrders)) {
    $sortOrder = 'DESC'; // Fallback to default if invalid
}

// SQL query for fetching materials with sorting and filtering
$sql = "SELECT id, accnum, title, author, subj, copyright, callno, status, isbn, date_added 
        FROM materials 
        WHERE (accnum LIKE ? OR title LIKE ? OR author LIKE ? OR subj LIKE ? OR copyright LIKE ? OR callno LIKE ? OR status LIKE ?)";

$params = [$search, $search, $search, $search, $search, $search, $search];
$types = str_repeat('s', count($params));

if (!empty($category)) {
    $sql .= " AND accnum LIKE ?";
    $params[] = $category;
    $types .= 's';
}

$sql .= " ORDER BY $sortField $sortOrder
          LIMIT ? OFFSET ?";

// Prepare the statement
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
}

// Bind parameters
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

// SQL query for counting total items
$total_sql = "SELECT COUNT(*) as count FROM materials 
              WHERE (accnum LIKE ? OR title LIKE ? OR author LIKE ? OR subj LIKE ? OR copyright LIKE ? OR callno LIKE ? OR status LIKE ?)";

$total_params = [$search, $search, $search, $search, $search, $search, $search];
$total_types = str_repeat('s', count($total_params));

if (!empty($category)) {
    $total_sql .= " AND accnum LIKE ?";
    $total_params[] = $category;
    $total_types .= 's';
}

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
