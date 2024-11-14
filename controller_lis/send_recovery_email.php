<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$token = bin2hex(random_bytes(16));

$query = "INSERT INTO password_resets (email, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $email, $token, $token);
$stmt->execute();

if ($stmt->affected_rows > 0) {
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
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'PUP Taguig Library: Password Recovery';

        $mail->Body = '
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                    <thead style="background-color: #800000; padding: 20px;">
                        <tr>
                            <th style="color: #fff; text-align: center; font-size: 20px; padding: 18px;">
                                Polytechnic University of the Philippines - Taguig<br>
                                <span style="font-size: 18px;">Library Information System</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody style="padding: 20px; color: #333;">
                        <tr>
                            <td style="font-size: 18px; padding: 20px 30px; text-align: justify;">
                                Dear User,
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; padding: 10px 30px; text-align: justify;">
                                You have requested to reset your password for the PUP Taguig Library System. Please click the link below to reset your password.
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding: 20px;">
                                <a href="http://localhost:4200/password-recovery?token=' . $token . '" style="padding: 12px 25px; background-color: #ffb700; color: #000; text-decoration: none; font-size: 16px; border-radius: 5px;">
                                    Reset Password
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; padding: 20px 30px; text-align: justify;">
                                If you did not request this change, you can safely ignore this email. This link will expire in 24 hours.
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

        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
    }
} else {
    echo json_encode(['success' => false]);
}
?>