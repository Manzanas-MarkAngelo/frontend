<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$query = "
    SELECT 
        r.title, 
        r.author, 
        r.year_published, 
        r.requester_type, 
        r.requester_name, 
        r.requester_id
    FROM request r
";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    echo json_encode([
        'success' => true,
        'requests' => $requests
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No requests found'
    ]);
}

$conn->close();
?>