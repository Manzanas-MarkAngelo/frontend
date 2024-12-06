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
$program = isset($_GET['program']) ? $_GET['program'] : '';
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

// Step 1: If a program is provided, find the subject id from the subjects table
$subjectId = null;
if (!empty($program)) {
    $programSearch = '%' . $program . '%';
    $subjectSql = "SELECT id FROM subjects WHERE subject_name LIKE ?";
    $subjectStmt = $conn->prepare($subjectSql);
    if ($subjectStmt) {
        $subjectStmt->bind_param('s', $programSearch);
        $subjectStmt->execute();
        $subjectResult = $subjectStmt->get_result();
        $subjectRow = $subjectResult->fetch_assoc();
        if ($subjectRow) {
            $subjectId = $subjectRow['id'];
        }
        $subjectStmt->close();
    }
}

// Step 2: Update the SQL query to handle multiple categories
$sql = "SELECT m.id, m.accnum, m.title, m.author, m.subj, m.copyright, m.callno, m.status, m.isbn, m.date_added, c.mat_type, 
               s.subject_name 
        FROM materials m
        LEFT JOIN category c ON m.categoryid = c.cat_id
        LEFT JOIN subjects s ON m.subject_id = s.id 
        WHERE (m.accnum LIKE ? OR m.title LIKE ? OR m.author LIKE ? OR m.subj LIKE ? OR m.copyright LIKE ? OR m.callno LIKE ? OR m.status LIKE ?)";

$params = [$search, $search, $search, $search, $search, $search, $search];
$types = str_repeat('s', count($params));

if (!empty($category)) {
    $categoryArray = explode(',', $category);
    $placeholders = implode(',', array_fill(0, count($categoryArray), '?'));
    $sql .= " AND c.accession_no IN ($placeholders)";
    $params = array_merge($params, $categoryArray);
    $types .= str_repeat('s', count($categoryArray));
}

if (!empty($subjectId)) {
    $sql .= " AND m.subject_id = ?";
    $params[] = $subjectId;
    $types .= 'i';
}

$sql .= " ORDER BY $sortField $sortOrder LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

// Prepare and bind parameters
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
}

$stmt->bind_param($types, ...$params);

$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    die('Execute failed: ' . htmlspecialchars($stmt->error));
}

$materials = [];
while ($row = $result->fetch_assoc()) {
    $materials[] = $row;
}

// Count total items for pagination
$total_sql = "SELECT COUNT(*) as count FROM materials m
              LEFT JOIN category c ON m.categoryid = c.cat_id
              WHERE (m.accnum LIKE ? OR m.title LIKE ? OR m.author LIKE ? OR m.subj LIKE ? OR m.copyright LIKE ? OR m.callno LIKE ? OR m.status LIKE ?)";
$total_params = [$search, $search, $search, $search, $search, $search, $search];
$total_types = str_repeat('s', count($total_params));

if (!empty($category)) {
    $total_sql .= " AND c.mat_type IN ($placeholders)";
    $total_params = array_merge($total_params, $categoryArray);
    $total_types .= str_repeat('s', count($categoryArray));
}

if (!empty($subjectId)) {
    $total_sql .= " AND m.subject_id = ?";
    $total_params[] = $subjectId;
    $total_types .= 'i';
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

$response = [
    'data' => $materials,
    'totalItems' => $total_items,
    'currentPage' => $page,
    'totalPages' => ceil($total_items / $limit)
];

echo json_encode($response);

$stmt->close();
$total_stmt->close();
$conn->close();
?>
