<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id']) || !isset($data['material_id'])) {
    echo json_encode(['error' => 'Invalid request: missing user_id or material_id']);
    exit;
}

$userId = mysqli_real_escape_string($conn, $data['user_id']);
$materialId = mysqli_real_escape_string($conn, $data['material_id']);

$maxAttempts = 5;
$attempt = 0;
$borrowing = null;

while ($attempt < $maxAttempts) {
    $borrowingQuery = "SELECT claim_date, due_date FROM borrowing WHERE user_id = '$userId' AND material_id = '$materialId'";
    $borrowingResult = mysqli_query($conn, $borrowingQuery);

    if ($borrowingResult && mysqli_num_rows($borrowingResult) > 0) {
        $borrowing = mysqli_fetch_assoc($borrowingResult);
        break;
    }

    usleep(500000);
    $attempt++;
}

if (!$borrowing) {
    echo json_encode(['error' => 'No borrowing record found for this user and material after multiple attempts']);
    exit;
}

$materialQuery = "SELECT title, author FROM materials WHERE id = '$materialId'";
$materialResult = mysqli_query($conn, $materialQuery);

if (!$materialResult || mysqli_num_rows($materialResult) === 0) {
    echo json_encode(['error' => 'No material found with the given id']);
    exit;
}

$material = mysqli_fetch_assoc($materialResult);

$borrower = null;
$studentQuery = "SELECT email, first_name, surname FROM students WHERE user_id = '$userId'";
$facultyQuery = "SELECT email, first_name, surname FROM faculty WHERE user_id = '$userId'";

$studentResult = mysqli_query($conn, $studentQuery);
if (mysqli_num_rows($studentResult) > 0) {
    $borrower = mysqli_fetch_assoc($studentResult);
} else {
    $facultyResult = mysqli_query($conn, $facultyQuery);
    if (mysqli_num_rows($facultyResult) > 0) {
        $borrower = mysqli_fetch_assoc($facultyResult);
    }
}

if (!$borrower) {
    echo json_encode(['error' => 'No borrower found with the given user id']);
    exit;
}

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
    $mail->Subject = 'Book Borrowed Successfully';

    $mail->Body = '
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                <thead style="background-color: #800000; padding: 20px;">
                    <tr>
                        <th style="color: #fff; text-align: center; font-size: 20px; padding: 18px;">
                            Polytechnic University of the Philippines - Taguig
                            <br>
                            <span style="font-size: 18px;">Library Information System</span>
                        </th>
                    </tr>
                </thead>
                <tbody style="padding: 20px; color: #333;">
                    <tr>
                        <td style="font-size: 18px; padding: 20px 30px; text-align: justify;">
                            Dear ' . $borrower['first_name'] . ' ' . $borrower['surname'] . ',
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 10px 30px; text-align: justify;">
                            You have successfully borrowed a book.
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 10px 30px; text-align: justify;">
                            <strong>Title:</strong> ' . $material['title'] . '<br>
                            <strong>Author:</strong> ' . $material['author'] . '<br>
                            <strong>Claim Date:</strong> ' . $borrowing['claim_date'] . '<br>
                            <strong>Due Date:</strong> ' . $borrowing['due_date'] . '
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 20px 30px; text-align: justify; color: #FF0000;">
                            Please be reminded that if the book is not returned by the due date, a fee of P10.00 (Ten Pesos) will be charged for each day past the due date.
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 20px 30px; text-align: justify;">
                            Thank you for using the PUP Taguig Library services.
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 20px 30px; text-align: justify;">
                            Best regards,<br>
                            PUP Taguig Library
                        </td>
                    </tr>
                </tbody>
                <tfoot style="background-color: #800000; color: #fff; text-align: center; padding: 20px;">
                    <tr>
                        <td style="font-size: 12px; padding: 10px 0;">
                            This is an automated email from PUP Taguig Library System.<br>
                            Please do not reply to this email.
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    ';

    if($mail->send()) {
        echo json_encode(['message' => 'Email sent successfully']);
    } else {
        echo json_encode(['error' => 'Failed to send email']);
    }

} catch (Exception $e) {
    echo json_encode(['error' => 'Email could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>