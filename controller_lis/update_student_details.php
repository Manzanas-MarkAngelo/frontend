<?php
header('Access-Control-Allow-Origin: *'); // Allows all origins, you can specify your domain instead of '*'
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allows specific methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allows specific headers
header('Content-Type: application/json');

// Handle the preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'db_connection.php'; 

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'];
    $student_number = $data['student_number'];
    $gender = $data['gender'];
    $first_name = $data['first_name'];
    $surname = $data['surname'];
    $course = $data['course'];
    $phone_number = $data['phone_number'];

    // Ensure this query matches your database structure
    $query = "UPDATE students SET 
              student_number = '$student_number',
              gender = '$gender',
              first_name = '$first_name',
              surname = '$surname',
              course = '$course',
              phone_number = '$phone_number'
              WHERE user_id = '$user_id'";

    if (mysqli_query($conn, $query)) {
        $response['status'] = 'success';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Update failed: ' . mysqli_error($conn);
    }

    echo json_encode($response);
    mysqli_close($conn);
}
?>
