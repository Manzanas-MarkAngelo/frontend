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

        if ($header !== ['Employee Number', 'First Name', 'Surname', 'Gender', 'Email', 'Phone Number', 'Department ID']) {
            echo json_encode(['success' => false, 'message' => 'Invalid CSV format.']);
            exit;
        }

        $conn->begin_transaction();

        try {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

            while (($row = fgetcsv($file)) !== false) {
                $empNumber = $row[0];
                $firstName = $row[1];
                $surname = $row[2];
                $gender = $row[3];
                $email = $row[4];
                $phoneNumber = $row[5];
                $deptId = $row[6];

                // Data validation
                if (!in_array($gender, ['Male', 'Female', 'Other'])) {
                    throw new Exception("Invalid gender: $gender for employee $empNumber");
                }
                if (strlen($phoneNumber) > 15) {
                    throw new Exception("Phone number too long: $phoneNumber for employee $empNumber");
                }

                // Check for duplicates
                $checkQuery = "SELECT * FROM faculty_checker WHERE emp_number = ?";
                $checkStmt = $conn->prepare($checkQuery);
                $checkStmt->bind_param("s", $empNumber);
                $checkStmt->execute();
                $result = $checkStmt->get_result();

                if ($result->num_rows > 0) {
                    $updateQuery = "
                        UPDATE faculty_checker 
                        SET first_name = ?, surname = ?, gender = ?, email = ?, phone_number = ?, dept_id = ? 
                        WHERE emp_number = ?";
                    $updateStmt = $conn->prepare($updateQuery);
                    $updateStmt->bind_param("sssssss", $firstName, $surname, $gender, $email, $phoneNumber, $deptId, $empNumber);
                    $updateStmt->execute();
                    error_log("Updated employee: $empNumber");
                } else {
                    $insertQuery = "
                        INSERT INTO faculty_checker (emp_number, first_name, surname, gender, email, phone_number, dept_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
                    $insertStmt = $conn->prepare($insertQuery);
                    $insertStmt->bind_param("sssssss", $empNumber, $firstName, $surname, $gender, $email, $phoneNumber, $deptId);
                    $insertStmt->execute();
                    error_log("Inserted new employee: $empNumber");
                }
            }

            fclose($file);
            $conn->commit();

            echo json_encode(['success' => true, 'message' => 'File processed successfully.']);
        } catch (Exception $e) {
            $conn->rollback();
            error_log("Error processing file: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Error processing file: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'File upload failed.']);
    }
}

$conn->close();
?>
