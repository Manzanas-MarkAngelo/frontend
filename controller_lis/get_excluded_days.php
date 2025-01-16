<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$query = "SELECT date FROM excluded_days";
$result = mysqli_query($conn, $query);

$dates = [];
while ($row = mysqli_fetch_assoc($result)) {
    $dates[] = $row['date'];
}

echo json_encode($dates);
?>