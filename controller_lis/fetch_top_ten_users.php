<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight requests
    http_response_code(200);
    exit;
}

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get month and year from the request
$month = isset($_GET['month']) ? intval($_GET['month']) : date('m');
$year = isset($_GET['year']) ? intval($_GET['year']) : date('Y'); 

// Step 1: Fetch top 10 most frequent users
$sql = "
    SELECT user_id, COUNT(*) AS times_in
    FROM time_log
    WHERE MONTH(time_in) = ? AND YEAR(time_in) = ?
    GROUP BY user_id
    ORDER BY times_in DESC
    LIMIT 10
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $month, $year);
$stmt->execute();
$result = $stmt->get_result();

$users = array();
while ($row = $result->fetch_assoc()) {
    $users[] = array(
        'user_id' => $row['user_id'],
        'times_in' => $row['times_in']
    );
}
$stmt->close();

// Step 2: Fetch user types for the retrieved user_ids
if (!empty($users)) {
    $user_ids = array_column($users, 'user_id');
    $user_ids_placeholder = implode(',', array_fill(0, count($user_ids), '?'));

    $sql = "
        SELECT id, user_type
        FROM users
        WHERE id IN ($user_ids_placeholder)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(str_repeat('i', count($user_ids)), ...$user_ids);
    $stmt->execute();
    $result = $stmt->get_result();

    $user_types = array();
    while ($row = $result->fetch_assoc()) {
        $user_types[$row['id']] = $row['user_type'];
    }
    $stmt->close();

    // Step 3: Fetch first_name and surname based on user_type
    foreach ($users as &$user) {
        $user_id = $user['user_id'];
        $user_type = isset($user_types[$user_id]) ? $user_types[$user_id] : 'Unknown';

        $first_name = 'Unknown'; // Default value
        $surname = 'Unknown'; // Default value

        if ($user_type === 'student') {
            $sql = "SELECT first_name, surname FROM students WHERE user_id = ?";
        } elseif ($user_type === 'faculty') {
            $sql = "SELECT first_name, surname FROM faculty WHERE user_id = ?";
        } elseif ($user_type === 'visitor') {
            $sql = "SELECT first_name, surname FROM visitor WHERE user_id = ?";
        } else {
            $sql = ""; // No valid user_type found
        }

        if ($sql) {
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $name_row = $result->fetch_assoc();
            if ($name_row) {
                $first_name = $name_row['first_name'];
                $surname = $name_row['surname'];
            }
            $stmt->close();
        }

        $user['first_name'] = $first_name;
        $user['surname'] = $surname;
        $user['user_type'] = $user_type;
    }

    $response = array(
        'data' => $users
    );

    echo json_encode($response);
}

$conn->close();
?>
