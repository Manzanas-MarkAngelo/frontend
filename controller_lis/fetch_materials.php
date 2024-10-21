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

if (isset($_GET['fetchAllIds']) && $_GET['fetchAllIds'] === 'true') {
    $sql = "SELECT id FROM materials";
    $result = $conn->query($sql);
    
    if ($result === false) {
        echo json_encode(['error' => 'Failed to fetch material IDs']);
        exit;
    }
    
    $materialIds = [];
    while ($row = $result->fetch_assoc()) {
        $materialIds[] = $row['id'];
    }
    
    echo json_encode($materialIds);
    $conn->close();
    exit;
}

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = ($page - 1) * $limit;
$search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : '%';
$category = isset($_GET['category']) ? $_GET['category'] : '';
$program = isset($_GET['program']) ? '%' . $_GET['program'] . '%' : '';
$sortField = isset($_GET['sortField']) ? $_GET['sortField'] : 'm.id';
$sortOrder = isset($_GET['sortOrder']) ? $_GET['sortOrder'] : 'DESC';

$allowedSortFields = ['title', 'author', 'subj', 'copyright', 'callno', 'status', 'date_added', 'categoryid', 'm.id'];
if (!in_array($sortField, $allowedSortFields)) {
    $sortField = 'm.id';
}

$allowedSortOrders = ['ASC', 'DESC'];
if (!in_array(strtoupper($sortOrder), $allowedSortOrders)) {
    $sortOrder = 'DESC';
}

// Update the SQL query to include a join with the subjects table to get subject_name
$sql = "SELECT m.id, m.accnum, m.title, m.author, m.subj, m.copyright, m.callno, m.status, m.isbn, m.date_added, c.mat_type, 
               s.subject_name 
        FROM materials m
        LEFT JOIN category c ON m.categoryid = c.cat_id
        LEFT JOIN subjects s ON m.subject_id = s.id 
        WHERE (m.accnum LIKE ? OR m.title LIKE ? OR m.author LIKE ? OR m.subj LIKE ? OR m.copyright LIKE ? OR m.callno LIKE ? OR m.status LIKE ?)";

if (!empty($category)) {
    $sql .= " AND m.accnum LIKE ?";
}

if (!empty($program)) {
    $sql .= " AND (m.title LIKE ? OR m.subj LIKE ?)";
}

if ($sortField === 'categoryid') {
    $sql .= " ORDER BY c.mat_type $sortOrder, m.id $sortOrder";
} else {
    $sql .= " ORDER BY $sortField $sortOrder";
}

$sql .= " LIMIT ? OFFSET ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
}

$params = [$search, $search, $search, $search, $search, $search, $search];
if (!empty($category)) {
    $params[] = '%' . $category . '%';
}
if (!empty($program)) {
    $params[] = $program;
    $params[] = $program;
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
    $materials[] = $row; // Now includes subject_name
}

$total_sql = "SELECT COUNT(*) as count FROM materials m
              LEFT JOIN category c ON m.categoryid = c.cat_id
              WHERE (m.accnum LIKE ? OR m.title LIKE ? OR m.author LIKE ? OR m.subj LIKE ? OR m.copyright LIKE ? OR m.callno LIKE ? OR m.status LIKE ?)";
              
$total_params = [$search, $search, $search, $search, $search, $search, $search];
if (!empty($category)) {
    $total_sql .= " AND m.accnum LIKE ?";
    $total_params[] = '%' . $category . '%';
}
if (!empty($program)) {
    $total_sql .= " AND (m.title LIKE ? OR m.subj LIKE ?)";
    $total_params[] = $program;
    $total_params[] = $program;
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
