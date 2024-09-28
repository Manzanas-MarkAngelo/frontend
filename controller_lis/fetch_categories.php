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
    // Fetch all rows and order by mat_type ascending
    $sql = "SELECT * FROM category ORDER BY mat_type ASC";
    $result = $conn->query($sql);

    $categories = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    }

    echo json_encode($categories);
}

$conn->close();
?>
