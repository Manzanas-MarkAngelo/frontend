<?php
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['file']['tmp_name'];

        // Open and read the CSV file
        $file = fopen($fileTmpPath, 'r');
        $header = fgetcsv($file); // Skip header row

        // Check if the columns match the expected format
        if ($header !== ['Student Number', 'First Name', 'Last Name', 'Email']) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSV format.']);
            exit;
        }

        $conn->begin_transaction();

        try {
            while (($row = fgetcsv($file)) !== false) {
                $studentNo = $row[0];
                $firstName = $row[1];
                $lastName = $row[2];
                $email = $row[3];

                // Check for duplicates
                $checkQuery = "SELECT * FROM student_checker WHERE studentNo = ?";
                $checkStmt = $conn->prepare($checkQuery);
                $checkStmt->bind_param("s", $studentNo);
                $checkStmt->execute();
                $result = $checkStmt->get_result();

                if ($result->num_rows > 0) {
                    // Update existing record
                    $updateQuery = "UPDATE student_checker SET studentFname = ?, studentLname = ?, email = ? WHERE studentNo = ?";
                    $updateStmt = $conn->prepare($updateQuery);
                    $updateStmt->bind_param("ssss", $firstName, $lastName, $email, $studentNo);
                    $updateStmt->execute();
                } else {
                    // Insert new record
                    $insertQuery = "INSERT INTO student_checker (studentNo, studentFname, studentLname, email) VALUES (?, ?, ?, ?)";
                    $insertStmt = $conn->prepare($insertQuery);
                    $insertStmt->bind_param("ssss", $studentNo, $firstName, $lastName, $email);
                    $insertStmt->execute();
                }
            }

            fclose($file);
            $conn->commit();

            echo json_encode(['success' => true, 'message' => 'File processed successfully.']);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Error processing file: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'File upload failed.']);
    }
}

$conn->close();
?>
