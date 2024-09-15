<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['cat_id'])) {
    $cat_id = intval($_GET['cat_id']);

    // For fiction (cat_id 22)
    if ($cat_id == 22) {
        $sql = "SELECT accession_no, counter FROM category WHERE cat_id = 22";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $accession_no = $row['accession_no'];
            $counter = intval($row['counter']) + 1; // Increment the counter for fiction
            $response = $accession_no . ' ' . $counter;
        } else {
            $response = "No records found for fiction.";
        }
    } 
    // For other categories
    else {
        $sql = "SELECT accession_no, counter FROM category WHERE cat_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $cat_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $accession_no = $row['accession_no'];

            // Add all counters except fiction and then add 1
            $sql_all_counters = "SELECT SUM(counter) AS total_counter FROM category WHERE cat_id != 22";
            $result_counters = $conn->query($sql_all_counters);
            $total_counter = $result_counters->fetch_assoc()['total_counter'];

            // Now add 1 to the summed counter
            $total_counter += 1;

            $response = $accession_no . ' ' . $total_counter;
        } else {
            $response = "No matching records found.";
        }
    }

    echo json_encode(['response' => $response]);

} else {
    echo json_encode(['error' => 'Invalid request.']);
}

$conn->close();
?>
