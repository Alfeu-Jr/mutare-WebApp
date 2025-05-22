<?php
if (isset($_POST['request'])) {

    include 'config.php';
    include 'crud.php';
    
    $crud = new crud();
    $request = new Request();
    $postData = [];

    $postData = $request->mysqliEscape($_POST);
    switch ($_POST['request']) {

        case 'guardar':
            $response = $request->guardar();
            break;

        case 'alterar':
            $response = $request->alterar();
            break;

        case 'listar_slc':
            $response = $request->listarSlc();
            break;

        case 'adicionarr':
            $response = $request->adicaoRapida();
            break;

    }
    echo json_encode($response);
    exit;
}
class Request
{
    public function mysqliEscape($string)
    {
        global $crud;
        $escaped_data = array();

        $datas = [];

        foreach ($string as $key => $value) {
            if (is_array($value)) {
                $escaped_data[$key] = $this->mysqliEscape($value); // Recursively escape nested arrays
            } else {
                $escaped_data[$key] = mysqli_real_escape_string($GLOBALS['con'], $value);
            }
        }

        unset($escaped_data['request']);
        // print_r
        return $escaped_data;
    }

    public function guardar()
    {
        global $crud;
        global $postData;
        global $guiao;
        
        $tabela = "categoria";
        $coluna = array();
        $valor = array();


        $response = "";

        try {

            $condicao = "categoria = '{$postData['categoria']}'";
        
            if ($crud->count($tabela, $condicao) > 0) {
                throw new Exception(code: 1);
            }

            // array_shift($_POST);
            
            // foreach ($postData as $key => $value) {
                $coluna[] =  'categoria';
                $valor[] =  $postData['categoria'];
            // }
        
                 !($crud->insert($tabela, $coluna, $valor)) ?  throw new Exception(code: 2): true;
                // }

            $response = array("status" => true);
        } catch (Exception $e) {
            $response = array("status" => false, "code" => $e->getCode(), "mess" => ($e->getMessage()));
        } finally {
            return $response;
        }
    }
}