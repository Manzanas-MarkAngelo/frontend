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

$accnum = isset($_GET['accnum']) ? $_GET['accnum'] : '';

if ($accnum) {
    $sql = "SELECT m.*, s.subject_name 
            FROM materials m
            LEFT JOIN subjects s ON m.subject_id = s.id
            WHERE m.accnum = ?";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("s", $accnum);
    $stmt->execute();
    $result = $stmt->get_result();
    $material = $result->fetch_assoc();

    if ($material && $material['status'] === 'Charged') {
        $sql = "SELECT b.user_id, s.student_number, f.emp_number, e.emp_num
                FROM borrowing b
                LEFT JOIN students s ON b.user_id = s.user_id
                LEFT JOIN faculty f ON b.user_id = f.user_id
                LEFT JOIN pupt_employees e ON b.user_id = e.user_id
                WHERE b.material_id = ? AND b.remark IN ('In Progress', 'Overdue', 'Processing')";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(['error' => 'Failed to prepare borrower statement: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param("i", $material['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $borrower = $result->fetch_assoc();

        if ($borrower) {
            if ($borrower['student_number']) {
                $material['borrower_id'] = $borrower['student_number'];
            } elseif ($borrower['emp_number']) {
                $material['borrower_id'] = $borrower['emp_number'];
            } elseif ($borrower['emp_num']) {
                $material['borrower_id'] = $borrower['emp_num'];
            }
        }
    }

    echo json_encode($material);
} else {
    echo json_encode(['error' => 'Invalid Accession Number']);
}

$stmt->close();
$conn->close();
?>