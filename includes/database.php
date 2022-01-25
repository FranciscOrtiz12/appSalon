<?php

function conectarDB(){ 
    $db = mysqli_connect('', '', '','');

    if (!$db) {
        echo "Error: No se pudo conectar a MySQL.";
        echo "error de depuración: " . mysqli_connect_errno();
        echo "error de depuración: " . mysqli_connect_error();
        exit;
    }
    return $db;
}
