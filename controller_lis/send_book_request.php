<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

include 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'libraryinformationsystemtaguig@gmail.com';
    $mail->Password = 'huya yqmo llmp fqwa';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('from@example.com', 'PUP Taguig Library');

    $data = json_decode(file_get_contents("php://input"), true);
    foreach ($data['emails'] as $email) {
        $mail->addAddress($email);
    }

    $mail->isHTML(true);
    $mail->Subject = 'PUP Taguig Library: Book Request';

    $mail->Body = '
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                <thead style="background-color: #800000; padding: 20px;">
                    <tr>
                        <th style="color: #fff; text-align: center; font-size: 24px; padding: 18px;">
                            PUP Taguig Library System
                        </th>
                    </tr>
                </thead>
                <tbody style="padding: 20px; color: #333;">
                    <tr>
                        <td style="font-size: 18px; padding: 20px 30px; text-align: justify;">
                            Dear Faculty Member,
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 10px 30px; text-align: justify;">
                            We hope this message finds you well. As part of our ongoing efforts to improve our library resources, we would like to offer you the opportunity to request books or other educational materials that you believe would benefit your teaching or research at PUP Taguig.
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 10px 30px; text-align: justify;">
                            If you have any specific books in mind, please follow the link below to submit your request. Your input is highly valued, and we aim to ensure that our library is equipped with the most relevant and up-to-date materials to support the academic community.
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 20px;">
                            <a href="http://localhost:4200/search-book?openModal=true" style="padding: 12px 25px; background-color: #ffb700; color: #000; text-decoration: none; font-size: 16px; border-radius: 5px;">
                                Request a Book
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 10px 30px; text-align: justify;">
                            Once you click the link, the book request form will open. Please provide the necessary details, and our team will do its best to accommodate your requests.
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; padding: 20px 30px; text-align: justify;">
                            Thank you for your contribution to enhancing the learning resources of PUP Taguig.
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
    echo json_encode(['message' => 'Emails have been sent successfully']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>