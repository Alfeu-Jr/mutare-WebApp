<?php
// database localhost
$host = "WIN-KEBCF09VIN4:3306";
$user = "remoteuser";
$password = "Pr!m&D!r&ct0ry";
$dbname = "mutare_solucoes";


try {

    $con = new mysqli($host, $user, $password, $dbname);
} catch (exception $ex) {
    //database cloud
    $host = "mutare-solucoes-alfeupassanduca01-ec02.l.aivencloud.com:13991";
    $user = "avnadmin";

    $dbname = "mutare-solucoes";
//     $host = "localhost:3307";
// $user = "root";
// $password = "1111";
// $dbname = "monitoria";
    

    $con = new mysqli($host, $user, $password, $dbname);
    if ($con->connect_error) {
        die("DB connection failed: " . $con->connect_error);
    }
}
