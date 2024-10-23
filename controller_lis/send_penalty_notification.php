<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// For error logging
error_reporting(E_ALL);
ini_set('log_errors', '1');
ini_set('error_log', '/path/to/your/log/file.txt'); // Update with a valid log path

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['user_id']) || !isset($data['material_id'])) {
    error_log("Invalid request: missing user_id or material_id");
    echo json_encode(['status' => 'error', 'message' => 'Invalid request: missing user_id or material_id']);
    exit;
}

$userId = mysqli_real_escape_string($conn, $data['user_id']);
$materialId = mysqli_real_escape_string($conn, $data['material_id']);

// Fetch borrowing record
$borrowingQuery = "SELECT claim_date, due_date, return_date FROM borrowing WHERE user_id = '$userId' AND material_id = '$materialId'";
$borrowingResult = mysqli_query($conn, $borrowingQuery);

if (!$borrowingResult || mysqli_num_rows($borrowingResult) === 0) {
    error_log("No borrowing record found for user_id $userId and material_id $materialId");
    echo json_encode(['status' => 'error', 'message' => 'No borrowing record found']);
    exit;
}

$borrowing = mysqli_fetch_assoc($borrowingResult);

// Fetch material details
$materialQuery = "SELECT title, author FROM materials WHERE id = '$materialId'";
$materialResult = mysqli_query($conn, $materialQuery);

if (!$materialResult || mysqli_num_rows($materialResult) === 0) {
    error_log("No material found with material_id $materialId");
    echo json_encode(['status' => 'error', 'message' => 'No material found']);
    exit;
}

$material = mysqli_fetch_assoc($materialResult);

// Fetch borrower details
$borrower = null;
$studentQuery = "SELECT email, first_name, surname FROM students WHERE user_id = '$userId'";
$facultyQuery = "SELECT email, first_name, surname FROM faculty WHERE user_id = '$userId'";
$employeeQuery = "SELECT email, first_name, surname FROM pupt_employees WHERE user_id = '$userId'";

$studentResult = mysqli_query($conn, $studentQuery);
if (mysqli_num_rows($studentResult) > 0) {
    $borrower = mysqli_fetch_assoc($studentResult);
} else {
    $facultyResult = mysqli_query($conn, $facultyQuery);
    if (mysqli_num_rows($facultyResult) > 0) {
        $borrower = mysqli_fetch_assoc($facultyResult);
    } else {
        $employeeResult = mysqli_query($conn, $employeeQuery);
        if (mysqli_num_rows($employeeResult) > 0) {
            $borrower = mysqli_fetch_assoc($employeeResult);
        }
    }
}

if (!$borrower) {
    error_log("No borrower found with user_id $userId");
    echo json_encode(['status' => 'error', 'message' => 'No borrower found']);
    exit;
}

// Calculate penalty
$dueDate = new DateTime($borrowing['due_date']);
$today = new DateTime();
$daysLate = max($dueDate->diff($today)->days, 0);
$penaltyAmount = $daysLate * 10; // P10 per day late

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'libraryinformationsystemtaguig@gmail.com';
    $mail->Password = 'huya yqmo llmp fqwa';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('libraryinformationsystemtaguig@gmail.com', 'PUP Taguig Library');
    $mail->addAddress($borrower['email']);

    $mail->isHTML(true);
    $mail->Subject = 'Penalty Notification';

    $mail->Body = "
        <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
            <table width='100%' style='max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);'>
                <thead style='background-color: #800000; padding: 20px;'>
                    <tr>
                        <th style='color: #fff; text-align: center; font-size: 20px; padding: 18px;'>
                            Polytechnic University of the Philippines - Taguig
                            <br>
                            <span style='font-size: 18px;'>Library Information System</span>
                        </th>
                    </tr>
                </thead>
                <tbody style='padding: 20px; color: #333;'>
                    <tr>
                        <td style='font-size: 18px; padding: 20px 30px; text-align: justify;'>
                            Dear {$borrower['first_name']} {$borrower['surname']},
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 16px; padding: 10px 30px; text-align: justify;'>
                            This is a reminder that the following book has not been returned on time and is subject to a late penalty.
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 16px; padding: 10px 30px; text-align: justify;'>
                            <strong>Title:</strong> {$material['title']}<br>
                            <strong>Author:</strong> {$material['author']}<br>
                            <strong>Due Date:</strong> {$borrowing['due_date']}<br>
                            <strong>Days Late:</strong> {$daysLate} day(s)<br>
                            <strong>Penalty Amount:</strong> P{$penaltyAmount}
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 16px; padding: 20px 30px; text-align: justify;'>
                            Please return the book as soon as possible and settle the penalty at the library.
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 16px; padding: 20px 30px; text-align: justify;'>
                            Thank you for your attention.
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 16px; padding: 20px 30px; text-align: justify;'>
                            Best regards,<br>
                            PUP Taguig Library
                        </td>
                    </tr>
                </tbody>
                <tfoot style='background-color: #800000; color: #fff; text-align: center; padding: 20px;'>
                    <tr>
                        <td style='font-size: 12px; padding: 10px 0;'>
                            This is an automated email from PUP Taguig Library System.<br>
                            Please do not reply to this email.
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    ";

    if ($mail->send()) {
        $updateQuery = "UPDATE borrowing SET last_notified_at = CURDATE() WHERE user_id = '$userId' AND material_id = '$materialId'";
        mysqli_query($conn, $updateQuery);

        echo json_encode(['status' => 'success', 'message' => 'Notification sent successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send email']);
    }
} catch (Exception $e) {
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    echo json_encode(['status' => 'error', 'message' => 'Email could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>