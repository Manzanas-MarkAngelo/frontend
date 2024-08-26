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

$year = isset($_GET['year']) ? (int)$_GET['year'] : null;
$wau = isset($_GET['wau']) ? $_GET['wau'] : 'monthly'; // Default to 'monthly'

if ($year) {
    if ($wau === 'daily') {
        // Initialize an array to store the user count for each day of the month
        $daily_counts = [];

        // SQL query to count the number of users who timed in for each day of the given year
        $sql = "SELECT 
                    DATE(time_in) AS date, 
                    COUNT(DISTINCT user_id) AS user_count
                FROM time_log
                WHERE YEAR(time_in) = ?
                GROUP BY DATE(time_in)";

        if ($stmt = $conn->prepare($sql)) {
            // Bind the year parameter
            $stmt->bind_param("i", $year);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($row = $result->fetch_assoc()) {
                // Store the user count for each day
                $daily_counts[$row['date']] = $row['user_count'];
            }

            $stmt->close();
        } else {
            echo json_encode(['error' => 'Failed to prepare the SQL statement.']);
            exit;
        }

        echo json_encode($daily_counts);

    } else {
        // Initialize an array to store the user count for each month
        $monthly_counts = [
            'January' => 0,
            'February' => 0,
            'March' => 0,
            'April' => 0,
            'May' => 0,
            'June' => 0,
            'July' => 0,
            'August' => 0,
            'September' => 0,
            'October' => 0,
            'November' => 0,
            'December' => 0,
        ];

        // SQL query to count the number of users who timed in for each month of the given year
        $sql = "SELECT 
                    MONTH(time_in) AS month, 
                    COUNT(DISTINCT user_id) AS user_count
                FROM time_log
                WHERE YEAR(time_in) = ?
                GROUP BY MONTH(time_in)";

        if ($stmt = $conn->prepare($sql)) {
            // Bind the year parameter
            $stmt->bind_param("i", $year);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($row = $result->fetch_assoc()) {
                // Map the month number to the month name and store the user count
                $month_name = date("F", mktime(0, 0, 0, $row['month'], 10));
                $monthly_counts[$month_name] = $row['user_count'];
            }

            $stmt->close();
        } else {
            echo json_encode(['error' => 'Failed to prepare the SQL statement.']);
            exit;
        }

        echo json_encode($monthly_counts);
    }
} else {
    echo json_encode(['error' => 'Year parameter is required.']);
}

$conn->close();
?>
