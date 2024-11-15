<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$limit = 7;  // Set items per page
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$offset = ($page - 1) * $limit;

$cat_id = isset($_GET['cat_id']) ? $_GET['cat_id'] : '';

if ($cat_id) {
    // Fetch a single row based on cat_id
    $sql = "SELECT * FROM category WHERE cat_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $cat_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $category = $result->fetch_assoc();

    if ($category) {
        echo json_encode($category);
    } else {
        echo json_encode(['error' => 'Category not found']);
    }
} else {
    // Get the total count of categories
    $count_sql = "SELECT COUNT(*) as total_categories FROM category";
    $count_result = $conn->query($count_sql);
    $total_categories = $count_result->fetch_assoc()['total_categories'];

    // Get the total count of materials
    $materials_count_sql = "SELECT COUNT(*) as total_materials FROM materials";
    $materials_count_result = $conn->query($materials_count_sql);
    $total_materials = $materials_count_result->fetch_assoc()['total_materials'];

    // Fetch paginated category results
    $sql = "SELECT * FROM category ORDER BY mat_type ASC LIMIT ? OFFSET ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();

    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    // Return paginated results with total counts
    echo json_encode([
        'categories' => $categories,
        'total_categories' => $total_categories,
        'total_materials' => $total_materials,
        'page' => $page,
        'limit' => $limit
    ]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
