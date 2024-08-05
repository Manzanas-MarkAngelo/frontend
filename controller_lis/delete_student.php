<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php'; 

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'];

    // Ensure this query matches your database structure
    $query = "DELETE FROM students WHERE user_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        $response['status'] = 'success';
        $response['message'] = 'Student deleted successfully';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Deletion failed: ' . $stmt->error;
    }

    echo json_encode($response);
    $stmt->close();
    mysqli_close($conn);
}
?>
