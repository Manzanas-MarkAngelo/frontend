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

try {
    // Initialize the response array
    $response = [];

    // SQL query to fetch the total number of users
    $sql_total_users = "SELECT COUNT(*) as total_users FROM users";
    $result_total_users = $conn->query($sql_total_users);

    if ($result_total_users) {
        $response['total_users'] = $result_total_users->fetch_assoc()['total_users'];
    } else {
        throw new Exception('Error fetching total users.');
    }

    // SQL query to fetch the total number of users for each user_type
    $sql_user_type_counts = "SELECT user_type, COUNT(*) as user_count FROM users GROUP BY user_type";
    $result_user_types = $conn->query($sql_user_type_counts);

    $user_type_counts = [];
    if ($result_user_types) {
        while ($row = $result_user_types->fetch_assoc()) {
            $user_type_counts[$row['user_type']] = $row['user_count'];
        }
        $response['user_type_counts'] = $user_type_counts;
    } else {
        throw new Exception('Error fetching user type counts.');
    }

    // SQL query to fetch the total number of materials (sum of the counter column)
    $sql_total_materials = "SELECT SUM(counter) as total_materials FROM category";
    $result_total_materials = $conn->query($sql_total_materials);

    if ($result_total_materials) {
        $response['total_materials'] = $result_total_materials->fetch_assoc()['total_materials'];
    } else {
        throw new Exception('Error fetching total materials.');
    }

    // SQL query to fetch the total number of materials for each mat_type
    $sql_category_counts = "SELECT mat_type, SUM(counter) as material_count FROM category GROUP BY mat_type";
    $result_category_counts = $conn->query($sql_category_counts);

    $category_counts = [];
    if ($result_category_counts) {
        while ($row = $result_category_counts->fetch_assoc()) {
            $category_counts[$row['mat_type']] = $row['material_count'];
        }
        $response['category_counts'] = $category_counts;
    } else {
        throw new Exception('Error fetching category counts.');
    }

    // Send the final combined response
    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>
