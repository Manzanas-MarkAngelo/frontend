<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Allow requests from any origin (CORS)
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'])) {
    $id = $data['id'];
    
    // Step 1: Find the material by its ID
    $sql = "SELECT categoryid FROM materials WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Material found
        $material = $result->fetch_assoc();
        $categoryid = $material['categoryid'];

        // Step 2: Go to the category table and find the row with the same cat_id
        $sql_category = "SELECT counter FROM category WHERE cat_id = ?";
        $stmt_category = $conn->prepare($sql_category);
        $stmt_category->bind_param("i", $categoryid);
        $stmt_category->execute();
        $result_category = $stmt_category->get_result();

        if ($result_category->num_rows > 0) {
            // Category found
            $category = $result_category->fetch_assoc();
            $counter = $category['counter'];

            // Step 3: Subtract 1 from the counter
            $new_counter = $counter - 1;

            // Step 4: Update the counter in the category table
            $sql_update = "UPDATE category SET counter = ? WHERE cat_id = ?";
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param("ii", $new_counter, $categoryid);

            if ($stmt_update->execute()) {
                // Step 5: Delete the material after updating the counter
                $sql_delete = "DELETE FROM materials WHERE id = ?";
                $stmt_delete = $conn->prepare($sql_delete);
                $stmt_delete->bind_param("i", $id);

                if ($stmt_delete->execute()) {
                    echo json_encode(["status" => "success", "message" => "Material deleted and category counter updated successfully"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Failed to delete material"]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update category counter"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Category not found"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Material not found"]);
    }

    $stmt->close();
    $stmt_category->close();
    $stmt_update->close();
    $stmt_delete->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}

$conn->close();
?>
