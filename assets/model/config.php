<?php
// database localhost
   $host = "localhost";
   $port = 3306;
$user = "root";
$password = "Pr!m&D!r&ct0ry";
$dbname = "mutare_solucoes";


try {

    $con = new mysqli($host, $user, $password, $dbname, $port);
        if ($con->connect_error) {
        die("DB connection failed: " . $con->connect_error);
    }
} catch (exception $ex) {
    //database cloud
   $host = "DESKTOP-506I64Q";
   $port = 3306;
$user = "root";
$password = "Pr!m&D!r&ct0ry";
$dbname = "mutare_solucoes";
//     $host = "localhost:3307";
// $user = "root";
// $password = "1111";
// $dbname = "monitoria";
    

    $con = new mysqli($host, $user, $password, $dbname, $port);
    if ($con->connect_error) {
        die("DB connection failed: " . $con->connect_error);
    }
}
