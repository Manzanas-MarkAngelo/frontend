<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'];
    $sql = "SELECT * FROM departments WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "Department not found."]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $data['id'];
    $dept_program = $data['dept_program'];
    $dept_abbreviation = $data['dept_abbreviation'];

    $sql = "UPDATE departments SET dept_program = '$dept_program', dept_abbreviation = '$dept_abbreviation' WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating record: " . $conn->error]);
    }
}

$conn->close();
?>