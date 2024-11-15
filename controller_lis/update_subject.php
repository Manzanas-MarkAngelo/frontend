<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS'); // Allow PUT method for updating
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if the request method is PUT
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Retrieve the subject ID from the query string
    if (isset($_GET['id'])) {
        $subject_id = intval($_GET['id']); // Sanitize and convert to integer for security

        // Get the incoming data from the request body
        $input = json_decode(file_get_contents("php://input"), true);
        $new_value = isset($input['new_value']) ? $input['new_value'] : null; // Assuming 'new_value' is the column name to be updated

        // Validate the incoming data
        if ($new_value !== null) {
            // Prepare the SQL statement to update the subject
            $stmt = $conn->prepare("UPDATE subjects SET subject_name = ? WHERE id = ?");
            $stmt->bind_param("si", $new_value, $subject_id); // Bind new value and subject ID

            // Execute the statement and check if it was successful
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Subject updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update subject']);
            }

            // Close the statement
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'New value is missing']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid subject ID']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Close the database connection
$conn->close();
?>
