<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Retrieve POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$mat_type = $data['mat_type'];
$accession_no = $data['accession_no'];
$cat_type = $data['cat_type'];
$duration = isset($data['duration']) ? $data['duration'] : 0;

// Get the largest current cat_id
$sql_get_max_id = "SELECT MAX(cat_id) AS max_id FROM category";
$result = $conn->query($sql_get_max_id);

if (!$result) {
    echo json_encode(["error" => "Error fetching max_id: " . $conn->error]);
    $conn->close();
    exit;
}

$row = $result->fetch_assoc();
$new_cat_id = $row['max_id'] + 1;

// Debugging output
error_log("Max ID: " . $row['max_id']);
error_log("New ID: " . $new_cat_id);

// SQL query to insert new category with the generated cat_id
$sql_insert = "INSERT INTO category (cat_id, mat_type, accession_no, cat_type, duration) 
               VALUES ('$new_cat_id', '$mat_type', '$accession_no', '$cat_type', '$duration')";

if ($conn->query($sql_insert) === TRUE) {
    echo json_encode(["success" => "New category added successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>
