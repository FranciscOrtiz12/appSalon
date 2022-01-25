<?php

namespace Controllers;

use Model\Cita;
use Model\citaServicio;
use Model\Servicio;

class APIController {

    public static function index(){
        
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function guardar(){

        //Almacena la cita y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        // Almacena los Servicios con el ID de la Cita
        $idServicios = explode(",", $_POST['servicios']);
        foreach( $idServicios as $idServicio ){
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        };

        //Retornamos la respuesta        
        echo json_encode(['resultado' => $resultado ]);
    }
}