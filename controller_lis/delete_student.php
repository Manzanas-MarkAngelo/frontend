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

    // Start transaction
    $conn->begin_transaction();

    try {
        // Delete student from students table
        $query_student = "DELETE FROM students WHERE user_id = ?";
        $stmt_student = $conn->prepare($query_student);
        $stmt_student->bind_param("i", $user_id);

        if (!$stmt_student->execute()) {
            throw new Exception('Failed to delete student: ' . $stmt_student->error);
        }

        // Delete user from users table
        $query_user = "DELETE FROM users WHERE id = ?";
        $stmt_user = $conn->prepare($query_user);
        $stmt_user->bind_param("i", $user_id);

        if (!$stmt_user->execute()) {
            throw new Exception('Failed to delete user: ' . $stmt_user->error);
        }

        // Commit transaction
        $conn->commit();

        $response['status'] = 'success';
        $response['message'] = 'Student and associated user deleted successfully';

    } catch (Exception $e) {
        // Rollback transaction
        $conn->rollback();

        $response['status'] = 'error';
        $response['message'] = 'Deletion failed: ' . $e->getMessage();
    }

    echo json_encode($response);

    $stmt_student->close();
    $stmt_user->close();
    mysqli_close($conn);
}
?>
