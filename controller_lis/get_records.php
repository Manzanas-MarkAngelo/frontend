<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input');
    }

    $recordType = $data['recordType'] ?? '';
    $user_id = $data['user_id'] ?? null;
    $itemsPerPage = $data['itemsPerPage'] ?? 13;
    $page = $data['page'] ?? 1;
    $offset = ($page - 1) * $itemsPerPage;

    if ($user_id) {
        $query = "SELECT user_id, emp_number, first_name, surname, gender, department, phone_number 
                  FROM faculty 
                  WHERE user_id = ?";
        $stmt = $conn->prepare($query);
        if ($stmt === false) {
            throw new Exception('Error preparing statement: ' . $conn->error);
        }
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $record = $result->fetch_assoc();
            echo json_encode($record);
        } else {
            echo json_encode(['error' => 'No record found']);
        }
        $stmt->close();
    } else {
        switch ($recordType) {
            case 'student':
                $query = "SELECT student_number, CONCAT(surname, ', ', first_name) as name, gender, course, phone_number 
                          FROM students 
                          ORDER BY created_at DESC
                          LIMIT $itemsPerPage 
                          OFFSET $offset";
                $countQuery = "SELECT COUNT(*) as total FROM students";
                break;
            case 'faculty':
                $query = "SELECT user_id, emp_number as emp_number, CONCAT(surname, ', ', first_name) as name, gender, department, phone_number 
                          FROM faculty 
                          ORDER BY created_at DESC
                          LIMIT $itemsPerPage 
                          OFFSET $offset";
                $countQuery = "SELECT COUNT(*) as total FROM faculty";
                break;
            case 'visitor':
                $query = "SELECT CONCAT(surname, ', ', first_name) as name, gender, phone_number, school 
                          FROM visitor 
                          ORDER BY created_at DESC
                          LIMIT $itemsPerPage 
                          OFFSET $offset";
                $countQuery = "SELECT COUNT(*) as total FROM visitor";
                break;
            default:
                $query = "SELECT student_number, CONCAT(surname, ', ', first_name) as name, gender, course, phone_number 
                          FROM students 
                          ORDER BY created_at DESC
                          LIMIT $itemsPerPage 
                          OFFSET $offset";
                $countQuery = "SELECT COUNT(*) as total FROM students";
        }

        $result = $conn->query($query);
        if ($result === false) {
            throw new Exception('Error executing query: ' . $conn->error);
        }

        $records = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
        }

        $totalResult = $conn->query($countQuery);
        if ($totalResult === false) {
            throw new Exception('Error executing count query: ' . $conn->error);
        }
        $totalRecords = $totalResult->fetch_assoc()['total'];
        $totalPages = ceil($totalRecords / $itemsPerPage);

        echo json_encode(['records' => $records, 'totalPages' => $totalPages]);
    }

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>
