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

$year = isset($_GET['year']) ? (int)$_GET['year'] : null;
$month = isset($_GET['month']) ? (int)$_GET['month'] : null;

if ($year && $month) {
    // Query to get the count of borrowed books by category, filtered by year and month,
    // and include all categories where duration is not 0, even if the borrowed count is 0.
    $sql = "
        SELECT 
            c.mat_type AS category,
            COUNT(b.id) AS borrowed_count
        FROM 
            category c
        LEFT JOIN 
            materials m ON c.cat_id = m.categoryid
        LEFT JOIN 
            borrowing b ON m.id = b.material_id AND YEAR(b.claim_date) = ? AND MONTH(b.claim_date) = ?
        WHERE 
            c.duration != 0
        GROUP BY 
            c.mat_type
    ";

    if ($stmt = $conn->prepare($sql)) {
        // Bind the year and month parameters
        $stmt->bind_param("ii", $year, $month);
        $stmt->execute();
        $result = $stmt->get_result();

        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[$row['category']] = (int)$row['borrowed_count'];
        }

        $stmt->close();

        echo json_encode($categories);
    } else {
        echo json_encode(['error' => 'Failed to prepare the SQL statement.']);
    }
} else {
    echo json_encode(['error' => 'Year and month parameters are required.']);
}

$conn->close();
?>
