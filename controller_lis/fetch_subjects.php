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

// Fetch parameters from the query
$searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';
$page = isset($_GET['page']) ? intval($_GET['page']) : null;
$categoryid = isset($_GET['categoryid']) ? intval($_GET['categoryid']) : null; // Fetch categoryid if provided
$limit = 7;  // Set the number of items per page for pagination

// If page parameter is set, apply pagination
if ($page !== null) {
    $offset = ($page - 1) * $limit; // Calculate the offset for the SQL query

    if (!empty($searchTerm) && $categoryid !== null) {
        // Step 1: First, get the subject_ids for the given categoryid
        $sql_subject_ids = "SELECT DISTINCT subject_id FROM materials WHERE categoryid = ?";
        $stmt_subject_ids = $conn->prepare($sql_subject_ids);
        $stmt_subject_ids->bind_param("i", $categoryid);
        $stmt_subject_ids->execute();
        $result_subject_ids = $stmt_subject_ids->get_result();

        $subject_ids = [];
        while ($row = $result_subject_ids->fetch_assoc()) {
            $subject_ids[] = $row['subject_id'];
        }

        // If there are no subject_ids, return empty result
        if (empty($subject_ids)) {
            echo json_encode([]);
            exit;
        }

        // Step 2: Use the subject_ids to filter subjects
        $placeholders = implode(',', array_fill(0, count($subject_ids), '?'));
        $sql = "SELECT * FROM subjects s
                WHERE s.id IN ($placeholders) AND s.subject_name LIKE ? 
                LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        $searchTermWildcard = '%' . $searchTerm . '%';
        
        // Bind parameters dynamically for the subject_ids
        $types = str_repeat('i', count($subject_ids)) . 'sii';
        $params = array_merge($subject_ids, [$searchTermWildcard, $limit, $offset]);
        $stmt->bind_param($types, ...$params);
    } elseif (!empty($searchTerm)) {
        // Pagination with search term only
        $sql = "SELECT * FROM subjects WHERE subject_name LIKE ? LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        $searchTermWildcard = '%' . $searchTerm . '%';
        $stmt->bind_param("sii", $searchTermWildcard, $limit, $offset);
    } elseif ($categoryid !== null) {
        // Step 1: First, get the subject_ids for the given categoryid
        $sql_subject_ids = "SELECT DISTINCT subject_id FROM materials WHERE categoryid = ?";
        $stmt_subject_ids = $conn->prepare($sql_subject_ids);
        $stmt_subject_ids->bind_param("i", $categoryid);
        $stmt_subject_ids->execute();
        $result_subject_ids = $stmt_subject_ids->get_result();

        $subject_ids = [];
        while ($row = $result_subject_ids->fetch_assoc()) {
            $subject_ids[] = $row['subject_id'];
        }

        // If there are no subject_ids, return empty result
        if (empty($subject_ids)) {
            echo json_encode([]);
            exit;
        }

        // Step 2: Use the subject_ids to filter subjects
        $placeholders = implode(',', array_fill(0, count($subject_ids), '?'));
        $sql = "SELECT * FROM subjects s
                WHERE s.id IN ($placeholders) LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);

        // Bind parameters dynamically for the subject_ids
        $types = str_repeat('i', count($subject_ids)) . 'ii';
        $params = array_merge($subject_ids, [$limit, $offset]);
        $stmt->bind_param($types, ...$params);
    } else {
        // Pagination without search term or category filter
        $sql = "SELECT * FROM subjects LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $limit, $offset);
    }
} else {
    // No pagination, fetch all subjects
    if (!empty($searchTerm) && $categoryid !== null) {
        // Step 1: Get the subject_ids for the given categoryid
        $sql_subject_ids = "SELECT DISTINCT subject_id FROM materials WHERE categoryid = ?";
        $stmt_subject_ids = $conn->prepare($sql_subject_ids);
        $stmt_subject_ids->bind_param("i", $categoryid);
        $stmt_subject_ids->execute();
        $result_subject_ids = $stmt_subject_ids->get_result();

        $subject_ids = [];
        while ($row = $result_subject_ids->fetch_assoc()) {
            $subject_ids[] = $row['subject_id'];
        }

        // If there are no subject_ids, return empty result
        if (empty($subject_ids)) {
            echo json_encode([]);
            exit;
        }

        // Step 2: Use the subject_ids to filter subjects
        $placeholders = implode(',', array_fill(0, count($subject_ids), '?'));
        $sql = "SELECT * FROM subjects s
                WHERE s.id IN ($placeholders) AND s.subject_name LIKE ?";
        $stmt = $conn->prepare($sql);
        $searchTermWildcard = '%' . $searchTerm . '%';

        // Bind parameters dynamically for the subject_ids
        $types = str_repeat('i', count($subject_ids)) . 's';
        $params = array_merge($subject_ids, [$searchTermWildcard]);
        $stmt->bind_param($types, ...$params);
    } elseif (!empty($searchTerm)) {
        // Search only with search term
        $sql = "SELECT * FROM subjects WHERE subject_name LIKE ?";
        $stmt = $conn->prepare($sql);
        $searchTermWildcard = '%' . $searchTerm . '%';
        $stmt->bind_param("s", $searchTermWildcard);
    } elseif ($categoryid !== null) {
        // Step 1: Get the subject_ids for the given categoryid
        $sql_subject_ids = "SELECT DISTINCT subject_id FROM materials WHERE categoryid = ?";
        $stmt_subject_ids = $conn->prepare($sql_subject_ids);
        $stmt_subject_ids->bind_param("i", $categoryid);
        $stmt_subject_ids->execute();
        $result_subject_ids = $stmt_subject_ids->get_result();

        $subject_ids = [];
        while ($row = $result_subject_ids->fetch_assoc()) {
            $subject_ids[] = $row['subject_id'];
        }

        // If there are no subject_ids, return empty result
        if (empty($subject_ids)) {
            echo json_encode([]);
            exit;
        }

        // Step 2: Use the subject_ids to filter subjects
        $placeholders = implode(',', array_fill(0, count($subject_ids), '?'));
        $sql = "SELECT * FROM subjects s
                WHERE s.id IN ($placeholders)";
        $stmt = $conn->prepare($sql);

        // Bind parameters dynamically for the subject_ids
        $types = str_repeat('i', count($subject_ids));
        $params = $subject_ids;
        $stmt->bind_param($types, ...$params);
    } else {
        // No filters, fetch all subjects
        $sql = "SELECT * FROM subjects";
        $stmt = $conn->prepare($sql);
    }
}

$stmt->execute();
$result = $stmt->get_result();

$subjects = [];
if ($result->num_rows > 0) {
    // Fetch and add each row to the subjects array
    while ($row = $result->fetch_assoc()) {
        $subjects[] = $row;
    }
    echo json_encode($subjects);
} else {
    echo json_encode(['error' => 'No subjects found']);
}

$stmt->close();
$conn->close();
?>
