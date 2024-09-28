<?php
include 'db_connection.php';

date_default_timezone_set('Asia/Shanghai');

$currentDate = date('Y-m-d');

$autoTimeoutQuery = "
    UPDATE time_log 
    SET time_out = CONCAT(DATE(time_in), ' 20:00:00') 
    WHERE time_out IS NULL 
    AND DATE(time_in) = ?";

$stmtTimeout = $conn->prepare($autoTimeoutQuery);
if ($stmtTimeout === false) {
    echo "Error preparing statement: " . $conn->error;
    exit;
}

$stmtTimeout->bind_param("s", $currentDate);

if (!$stmtTimeout->execute()) {
    echo "Error updating time-out: " . $conn->error;
    exit;
}

$stmtTimeout->close();
$conn->close();

echo "Auto timeout updated successfully!";
?>