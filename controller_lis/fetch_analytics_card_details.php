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

date_default_timezone_set('Asia/Shanghai');

$currentDate = date('Y-m-d');
$currentTime = date('H:i:s');

$autoTimeoutQueryPrevDays = "
    UPDATE time_log 
    SET time_out = CONCAT(DATE(time_in), ' 20:00:00') 
    WHERE time_out IS NULL 
    AND DATE(time_in) < ?";

$stmtTimeoutPrevDays = $conn->prepare($autoTimeoutQueryPrevDays);
if ($stmtTimeoutPrevDays === false) {
    echo json_encode(['error' => 'Error preparing statement: ' . $conn->error]);
    exit;
}

$stmtTimeoutPrevDays->bind_param("s", $currentDate);

if (!$stmtTimeoutPrevDays->execute()) {
    echo json_encode(['error' => 'Error updating time-out for previous days: ' . $conn->error]);
    exit;
}

$stmtTimeoutPrevDays->close();

if ($currentTime >= '20:00:00') {
    $autoTimeoutQueryToday = "
        UPDATE time_log 
        SET time_out = CONCAT(DATE(time_in), ' 20:00:00') 
        WHERE time_out IS NULL 
        AND DATE(time_in) = ?";

    $stmtTimeoutToday = $conn->prepare($autoTimeoutQueryToday);
    if ($stmtTimeoutToday === false) {
        echo json_encode(['error' => 'Error preparing statement for today: ' . $conn->error]);
        exit;
    }

    $stmtTimeoutToday->bind_param("s", $currentDate);

    if (!$stmtTimeoutToday->execute()) {
        echo json_encode(['error' => 'Error updating time-out for today: ' . $conn->error]);
        exit;
    }

    $stmtTimeoutToday->close();
}

try {
    // Initialize the response array
    $response = [];

    // SQL query to fetch the total number of users
    $sql_total_users = "SELECT COUNT(*) as total_users FROM users";
    $result_total_users = $conn->query($sql_total_users);

    if ($result_total_users) {
        $response['total_users'] = $result_total_users->fetch_assoc()['total_users'];
    } else {
        throw new Exception('Error fetching total users.');
    }

    // SQL query to fetch the total number of users for each user_type
    $sql_user_type_counts = "SELECT user_type, COUNT(*) as user_count FROM users GROUP BY user_type";
    $result_user_types = $conn->query($sql_user_type_counts);

    $user_type_counts = [];
    if ($result_user_types) {
        while ($row = $result_user_types->fetch_assoc()) {
            $user_type_counts[$row['user_type']] = $row['user_count'];
        }
        $response['user_type_counts'] = $user_type_counts;
    } else {
        throw new Exception('Error fetching user type counts.');
    }

    // SQL query to fetch the total number of materials (sum of the counter column)
    $sql_total_materials = "SELECT SUM(counter) as total_materials FROM category";
    $result_total_materials = $conn->query($sql_total_materials);

    if ($result_total_materials) {
        $response['total_materials'] = $result_total_materials->fetch_assoc()['total_materials'];
    } else {
        throw new Exception('Error fetching total materials.');
    }

    // SQL query to fetch the total number of materials for each mat_type
    $sql_category_counts = "SELECT mat_type, SUM(counter) as material_count FROM category GROUP BY mat_type";
    $result_category_counts = $conn->query($sql_category_counts);

    $category_counts = [];
    if ($result_category_counts) {
        while ($row = $result_category_counts->fetch_assoc()) {
            $category_counts[$row['mat_type']] = $row['material_count'];
        }
        $response['category_counts'] = $category_counts;
    } else {
        throw new Exception('Error fetching category counts.');
    }

    // SQL query to fetch the total number of CATEGORIES (count of rows in category table)
    $sql_total_categories = "SELECT COUNT(*) as total_categories FROM category";
    $result_total_categories = $conn->query($sql_total_categories);

    if ($result_total_categories) {
        $response['total_categories'] = $result_total_categories->fetch_assoc()['total_categories'];
    } else {
        throw new Exception('Error fetching total categories.');
    }

    // SQL query to fetch the total number of rows in the DEPARTMENTS table
    $sql_total_departments = "SELECT COUNT(*) as total_departments FROM departments";
    $result_total_departments = $conn->query($sql_total_departments);

    if ($result_total_departments) {
        $response['total_departments'] = $result_total_departments->fetch_assoc()['total_departments'];
    } else {
        throw new Exception('Error fetching total departments.');
    }

    // Total number of rows in the PROGRAMS
    $sql_total_departments = "SELECT COUNT(*) as total_programs FROM departments";
    $result_total_departments = $conn->query($sql_total_departments);   
    if ($result_total_departments) {
        $response['total_programs'] = $result_total_departments->fetch_assoc()['total_programs'];
    } else {
        throw new Exception('Error fetching total departments.');
    }

    // SQL query to count rows in the BORROWING table with remark = "In Progress"
    $sql_total_charged = "SELECT COUNT(*) as total_charged FROM borrowing WHERE remark = 'In Progress'";
    $result_total_charged = $conn->query($sql_total_charged);
 
    if ($result_total_charged) {
        $response['total_charged'] = $result_total_charged->fetch_assoc()['total_charged'];
    } else {
        throw new Exception('Error fetching total charged.');
    }

    // SQL query to count rows in the BORROWING table with remark = "Overdue"
    $sql_total_charged = "SELECT COUNT(*) as total_overdue FROM borrowing WHERE remark = 'Overdue'";
    $result_total_charged = $conn->query($sql_total_charged);
 
    if ($result_total_charged) {
        $response['total_overdue'] = $result_total_charged->fetch_assoc()['total_overdue'];
    } else {
        throw new Exception('Error fetching total charged.');
    }

    // Get current date in the format 'Y-m-d'
    $current_date = date('Y-m-d');
     
    // SQL query to get total time_ins for the current date
    $sql_total_time_ins = "SELECT COUNT(*) as total_time_ins FROM time_log WHERE DATE(time_in) = '$current_date'";
    $result_total_time_ins = $conn->query($sql_total_time_ins);
     
    if ($result_total_time_ins) {
        $response['total_time_ins'] = $result_total_time_ins->fetch_assoc()['total_time_ins'];
    } else {
        throw new Exception('Error fetching total time ins.');
    }
     
    // SQL query to get total time_outs for the current date
    $sql_total_time_outs = "SELECT COUNT(*) as total_time_outs FROM time_log WHERE DATE(time_out) = '$current_date'";
    $result_total_time_outs = $conn->query($sql_total_time_outs);
     
    if ($result_total_time_outs) {
        $response['total_time_outs'] = $result_total_time_outs->fetch_assoc()['total_time_outs'];
    } else {
        throw new Exception('Error fetching total time outs.');
    }

    // SQL query to count the total number of borrowers (rows in borrowing table)
    $sql_total_borrowers = "SELECT COUNT(*) as total_borrowers FROM borrowing";
    $result_total_borrowers = $conn->query($sql_total_borrowers);
      
    if ($result_total_borrowers) {
        $response['total_borrowers'] = $result_total_borrowers->fetch_assoc()['total_borrowers'];
    } else {
        throw new Exception('Error fetching total borrowers.');
    }

    // Send the final combined response
    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>