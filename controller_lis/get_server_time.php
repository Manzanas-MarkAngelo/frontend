<?php
// Set the timezone explicitly to ensure server time is used
date_default_timezone_set('Asia/Shanghai');

// Set appropriate headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Fetch server time
    $currentTime = date('Y-m-d\TH:i:sP');
    $serverTimezone = date_default_timezone_get();

    // Send the response
    echo json_encode([
        'success' => true,
        'currentTime' => $currentTime,
        'serverTimezone' => $serverTimezone,
        'serverInfo' => $_SERVER['SERVER_SOFTWARE'] // Debug: Check server environment
    ]);
} catch (Exception $e) {
    // Handle errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch server time',
        'details' => $e->getMessage()
    ]);
}
?>
