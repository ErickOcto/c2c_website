<?php
$mysqli = new mysqli("localhost", "root", "", "c2c_database");
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL via localhost: " . $mysqli->connect_error . "\n";
} else {
    echo "Successfully connected via localhost!\n";
}
$mysqli2 = new mysqli("127.0.0.1", "root", "", "c2c_database");
if ($mysqli2->connect_errno) {
    echo "Failed to connect to MySQL via 127.0.0.1: " . $mysqli2->connect_error . "\n";
} else {
    echo "Successfully connected via 127.0.0.1!\n";
}
