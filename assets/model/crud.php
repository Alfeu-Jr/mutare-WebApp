<?php
include_once '../model/config.php';

$crud = new crud();

class crud
{
    public function read($collumns, $table, $condition)
    {
        $i = 0;
        if (mb_strlen($collumns) == 0) {
            $collumns = "*";
        }
        if (mb_strlen($condition) == 0) {
            $condition = true;
        }
        $query = "SELECT " . $collumns . " FROM " . $table . " WHERE 1 and " . $condition;
        // echo($query);
        $record = mysqli_query($GLOBALS['con'], "SELECT " . $collumns . " FROM " . $table . " WHERE 1 and " . $condition);

        $response = array();

        if (mysqli_num_rows($record) > 1) {
            while ($row = mysqli_fetch_assoc($record)) {
                $response[] = $row; 
                
            }
        } 
        elseif (mysqli_num_rows($record) == 1) {
            $response = mysqli_fetch_assoc($record);
        }
        return $response;
    }

    public function readDataTable($collumns, $table, $condition)
    {
        $i = 0;
        if (mb_strlen($collumns) == 0) {
            $collumns = "*";
        }
        if (mb_strlen($condition) == 0) {
            $condition = true;
        }
        // $query = "SELECT " . $collumns . " FROM " . $table . " WHERE 1 and " . $condition;
        // echo "SELECT " . $collumns . " FROM " . $table . " WHERE 1 and " . $condition;
        $record = mysqli_query($GLOBALS['con'], "SELECT " . $collumns . " FROM " . $table . " WHERE 1 and " . $condition);
        $response = array();

        if (mysqli_num_rows($record) > 0) {
            while ($row = mysqli_fetch_assoc($record)) {
                $response[] = $row;
                //print_r($response);
            }
        }
        return $response;
    }

    public function count($table, $condiction)
    {

        if (mb_strlen($condiction) == 0) {
            $sel = mysqli_query($GLOBALS['con'], "SELECT count(*) AS count from " . $table . " AS T");
        } else {
            $sel = mysqli_query($GLOBALS['con'], "SELECT count(*) AS count from " . $table . " where 1 and " . $condiction);
        }

        $records = mysqli_fetch_assoc($sel);
        return $records['count'];
    }

    // classe a ser removida, todas as heranças terão que passar a ter parâmetros como arrays como ao invés de uma unica string
    // public function insertt($table, $collumns, $values)
    // {
    //     global $con;
    //     $sql = "INSERT INTO " . $table . "(" . $collumns . ") values (" . $values . ")";
    //     if (mysqli_query($con, $sql)) {
    //         return 1;
    //     } else {
    //         return "Error: " . $sql . "<br>" . mysqli_error($con);
    //     }
    // }

    //nova classe insert
    public function insert($table, $column, $value)
    {
        global $con;
        $columns = "";
        $values = "";

        for ($i = 0; $i < count($column); $i++) {
            $columns .= $column[$i];

            $values .= "'" . $value[$i] . "'";
            if ($i != count($column) - 1) {
                $columns .= ", ";
                $values .= ", ";
            }
        }
        global $con;
        $sql = "INSERT INTO " . $table . "(" . $columns . ") values (" . $values . ")";
        if (mysqli_query($con, $sql)) {
            return true;
        } else {
            return "Error: " . $sql . "<br>" . mysqli_error($con);
        }
    }

    public function insertMulti($tabela, $coluna, $valor)
    {
        global $con;
        $valores = implode(', ', array_map(function($item) {
            return "($item)";
        }, $valor));

        $colunas = implode(', ', $coluna);

        global $con;
        $sql = "INSERT INTO " . $tabela . "(" . $colunas . ") values " . $valores ;
   
//    echo $sql;     
   if (mysqli_query($con, $sql)) {
            return true;
        } else {
            return "Error: " . $sql . "<br>" . mysqli_error($con);
        }
    }
    
    public function deleteMulti($tabela, $valor)
    {
        global $con;

        $valores = implode(' OR ', $valor);

        global $con;
        $sql = "DELETE FROM " . $tabela . " WHERE " . $valores ;
   
    //    echo $sql; 

     if (mysqli_query($con, $sql)) {
            return true;
        } else {
            return "Error: " . $sql . "<br>" . mysqli_error($con);
        }
    }

    public function insertbyselect($table, $columns, $values, $tablefrom, $column, $value)
    {
        global $con;
        $sql = "INSERT INTO $table (" . $columns . ") SELECT $values FROM $tablefrom WHERE $column = $value";
        if (mysqli_query($con, $sql)) {
            return true;
        } else {
            return "Error: " . $sql . "<br>" . mysqli_error($con);
        }
    }

    public function delete($table, $collumn, $value)
    {
        global $con;
        $sql = "DELETE FROM $table WHERE $collumn = '$value'";
        if (mysqli_query($con, $sql)) {
            return 1;
        } else {
            return "Error: " . $sql . "\n" . mysqli_error($con);
        }
    }

    public function update($table, $columns, $values, $condition)
    {
        /**
         * Valor unico
         * insert("minha_tabela", "nome", "'Lucas'");
         */

        /*
         * Valores multiploes
         * multiplos valores
        $dados = array("Lucas", 25, "Masculino");
        $values = "'" . implode("','", $dados) . "'";
        insert("minha_tabela", "nome, idade, sexo", $values);
         */
        global $con;
        $set = "";
        if(is_array($columns)){

            for ($i = 0; $i < count($columns); $i++) {
                $set .= $columns[$i] . "='" . $values[$i] . "'";
                if ($i != count($columns) - 1) {
                    $set .= ", ";
                }
            }
        }else{
            $set .= $columns . "='" . $values . "'";
        }
        
        $sql = "UPDATE " . $table . " SET " . $set . " WHERE " . $condition;
        // echo $sql;
        if (mysqli_query($con, $sql)) {
            return true;
        } else {
            return "Error: " . $sql . "<br>" . mysqli_error($con);
        }
    }
    public function update_simples($table, $columns, $values, $condition)
    {
        /**
         * Valor unico
         * insert("minha_tabela", "nome", "'Lucas'");
         */

        /*
         * Valores multiploes
         * multiplos valores
        $dados = array("Lucas", 25, "Masculino");
        $values = "'" . implode("','", $dados) . "'";
        insert("minha_tabela", "nome, idade, sexo", $values);
         */
        global $con;
        $set = "";
        if(is_array($columns)){

            for ($i = 0; $i < count($columns); $i++) {
                //diferença nas aspas simples
                $set .= $columns[$i] . "=" . $values[$i] . "";
                if ($i != count($columns) - 1) {
                    $set .= ", ";
                }
            }
        }else{
            $set .= $columns . "=" . $values . "";
        }
        if (mb_strlen($condition) == 0) {
            $condition = "true";
        }
        
        $sql = "UPDATE " . $table . " SET " . $set . " WHERE " . $condition;
        // echo $sql;
        if (mysqli_query($con, $sql)) {
            return true;
        } else {
            return "Error: " . $sql . "<br>" . mysqli_error($con);
        }
    }

    public function select($collumns, $table, $condicao){
        $i = 0;
        $clausula = '';

        if (mb_strlen($collumns) == 0) {
            $collumns = "*";
        }
        // if (mb_strlen($condicao) > 0) {
            
        //     $condicao = true;
        // }
        if(!strpos($table, "GROUP BY")){
            if (mb_strlen($condicao) > 0) {
                $clausula = " WHERE 1 and " . $condicao;
                }
        }
        // else{
        //     // $clausula = 
        //     if (mb_strlen($condicao) > 0) {
        //     $clausula = " WHERE 1 and " . $condicao;
        //         // $instancia = true;
        //     }
        //     else
        // }
        // $query = "SELECT " . $collumns . " FROM " . $table . " WHERE 1 and " . $condition;
        // echo "SELECT " . $collumns . " FROM " . $table . " WHERE 1 and " . $condition;
        // echo("SELECT " . $collumns . " FROM " . $table . $clausula);
        $record = mysqli_query($GLOBALS['con'], "SELECT " . $collumns . " FROM " . $table . $clausula);
        $response = array();

        if (mysqli_num_rows($record) > 0) {
            while ($row = mysqli_fetch_assoc($record)) {
                $response[] = $row;
                //print_r($response);
            }
        }
        return $response;
    }
 
}
