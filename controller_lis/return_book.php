<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$material_id = $data['material_id'] ?? null;

if ($material_id) {
    $sql = "SELECT * FROM borrowing WHERE material_id = ? AND (remark = 'In Progress' OR remark = 'Processing')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $material_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $return_date = date('Y-m-d');

        $row = $result->fetch_assoc();
        $due_date = $row['due_date'];
        $remark = (strtotime($return_date) > strtotime($due_date)) ? 'Returned Late' : 'Returned';

        $sql = "UPDATE borrowing 
                SET return_date = ?, remark = ? 
                WHERE material_id = ? AND (remark = 'In Progress' OR remark = 'Processing')";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssi', $return_date, $remark, $material_id);

        if ($stmt->execute()) {
            $sql = "UPDATE materials SET status = 'Available' WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $material_id);
            $stmt->execute();

            echo json_encode(['status' => 'success', 'message' => 'Book returned successfully!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update borrowing record.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Material ID not found or not in progress.']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid material ID.']);
}

$conn->close();
?>