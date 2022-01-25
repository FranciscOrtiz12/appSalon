<?php

namespace Model;

class Cita extends ActiveRecord {
    //Base de datos
    protected static $tabla = 'citas';
    protected static $columnasDB = ['id','fecha','hora','id_user'];

    public $id;
    public $fecha;
    public $hora;
    public $id_user;

    public function __construct( $args = [] )
    {
        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
        $this->id_user = $args['id_user'] ?? '';
    }

    
}