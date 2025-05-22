<?php
if (isset($_POST['request_geral'])) {

    include 'config.php';
    include 'crud.php';
    
    $crud = new crud();
    $request = new Request();
    $postData = [];

    $postData = $request->mysqliEscape($_POST);
    switch ($_POST['request_geral']) {

        case 'carregar':
            $response = $request->carregar();
            break;

        case 'alterar':
            $response = $request->alterar();
            break;

        case 'listar_slc':
            $response = $request->listarSlc();
            break;

        case 'adicionar':
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

    // prametros: {.... tabela: 'nome_da_tabela', condicao: [['coluna', 'valor']]}
    public function listarSlc()
    {

        global $crud;
        global $request;
        global $postData;
        $condicao = '';
        $user_id = '';
        $condi = [];

        if (isset($postData['condicao'])) {
            if ($postData['condicao'] == "user_centro") {
                session_start();
                $user_id = "id = '{$_SESSION['user_id']}'";

                $response = $crud->read("centro", "utilizador", $user_id);
                $centro = $response['centro'];

                if ($centro != 0 && $centro != 1) {
                    $result = explode(", ", $centro);

                    foreach ($result as $valor) {
                        $valor = str_replace("'", "''", $valor);
                        $condi[] = "'{$valor}'";
                    }
                    $condicao = "centro IN (" . implode(', ', $condi) . ")";
                } else if ($centro == 0) {
                    $condicao = 'false';
                }
            }
        }
        // echo $condicao;
        $response = $crud->select("", $postData['tabela'], $condicao);
        return $response;
    }

    public function countTable()
    {
        global $crud;
        global $postData;
        $table = [];
        $response = [];

        $condicao = '';
        // $tabela = $postData['tabela'];

        if (isset($postData['condicao'])) {
            $condicao = $postData['condicao'];
            // echo($condicao); 
        }


        foreach ($postData['tabela'] as $tabela) {
            $response[$tabela] = $crud->count($tabela, $condicao);
        }
        // print_r($response);
        // $response = $crud->count_table($table);
        return array("status" => true, "data" => $response);
    }

    public function guardar()
    {
        global $crud;
        global $postData;
        $response = [];
        $condicao = '';

        $tabela = $postData['tabela'];

        $condicao = $postData['condicao'];

        $coluna = array();
        $valor = array();

        try {
            array_shift($postData);
            foreach ($postData as $key => $value) {
                $coluna[] = $key;
                $valor[] = $value;
            }

            // adiciona a informcacao do actual user
            session_start();
            $coluna[] = 'user_insert';
            $valor[] = $_SESSION['user_id'];

            $date = new DateTime();
            $coluna[] = 'date_insert';
            $valor[] = $date->format('d-m-Y H:i');


            if ($crud->count($tabela, $condicao) > 0) {
                throw new Exception(code: 2);
            }

            // a condicao deve obeder a seguinte estrutura : ['col', val], [] x n .....]
            foreach ($condicao as $valor) {
                $cond = $valor[0] . ' = ' . $valor[1];

                if ($crud->count($tabela, $cond) > 0) {
                    throw new Exception(code: 2);
                }
                echo $cond;
            }

            throw new Exception(code: 0);
            // Levantamento dos ficheiros enviados na requisição
            // foreach ($_FILES as $key => $value) {
            //     $coluna[] = mysqli_real_escape_string($GLOBALS['con'], $key);
            //     $valor[] = mysqli_real_escape_string($GLOBALS['con'], $value["name"]);
            //     $fileName = ($value["name"]);
            //     $fileTmpName = ($value["tmp_name"]);
            // }

            // $fileUpload = '../../arquivos/guiao/' . $fileName;
            // $condiction = "{$$postData['tabela']} = '{$fileName}'";

            // if ($crud->count($tabela, $condiction) == 0) { // verifica se nao existe um ficheiro com o mesmo nome
            //     if ($crud->insert($tabela, $coluna, $valor) == true) { //verifica se a inserção foi bem sucedida
            //         if (move_uploaded_file($fileTmpName, $target_dir . $fileName)) {
            //         } else {
            //             $crud->insert($tabela, "filename", $fileName);
            //             throw new Exception(code: 3);
            //         } //faz o upload do ficheiro
            //     } else {
            //         throw new Exception(code: 1);
            //     }
            // } else {
            //     throw new Exception(code: 2);
            // }



            $response = array("status" => true);
        } catch (Exception $e) {
            $response = array("status" => false, "code" => $e->getCode(), "mess" => ($e->getMessage()));
        } finally {
            return $response;
        }
    }

    public function detalhe($data)
    {

        global $crud;
        $tabela = $data['tabela'];
        $condicao = '';

        $cond = [];

        if (isset($data['condicao'])) {
            foreach ($data['condicao'] as $valor) {
                $cond[] = "{$valor[0]} = '{$valor[1]}'";
            }
            $condicao = implode(' and ', $cond);
        }

        if (isset($data['coluna'])) {
            $coluna = $data['coluna'];
        } else {
            $coluna = '';
        }

        $response = $crud->read($coluna, $tabela, $condicao);

        if (count($response) > 0) {
            $response = array("status" => true, "data" => $response);
        } else {
            $response = array("status" => false, "data" => "Nenhum registro encontrado");
        }

        return $response;
    }

    public function carregar()
    {
        global $crud;
        global $postData;
        $tabela = $postData['tabela'];
        $condicao = '';

        $cond = [];

        if (isset($postData['clausula'])) {
            $condicao = "true {$postData['clausula']}";
        }

        if (isset($postData['condicao'])) {
            foreach ($postData['condicao'] as $valor) {
                $cond[] = "{$valor[0]} = '{$valor[1]}'";
            }
            $condicao = $condicao . implode(' and ', $cond);
        }

        if (isset($postData['coluna'])) {
            $coluna = $postData['coluna'];
        } else {
            $coluna = '';
        }

        $response = $crud->read($coluna, $tabela, $condicao);

        if (count($response) > 0) {
            $response = array("status" => true, "data" => $response);
        } else {
            $response = array("status" => false, "data" => "Nenhum registro encontrado");
        }

        return $response;
    }

    public function alterar()
    {
        global $crud;
        global $postData;
        $tabela = $postData["tabela"];
        $id = $postData["id"];
        $coluna = array();
        $valor = array();

        try {
            try{
                unset($postData['request_geral']);
            }
            catch(Exception $ex){
            }

            unset($postData['tabela'], $postData['id']);

            $response = "";

            foreach ($postData as $key => $value) {
                $coluna[] =  $key;
                $valor[] =  $value;
            }

            $condicao = "id = '{$id}'";

            // print_r($coluna);
            // print_r($valor);
            // print_r($coluna);

            if ($crud->update($tabela, $coluna, $valor, $condicao) != true) {
                throw new Exception(code: 1);
            }

            $response = array("status" => true);
        } catch (Exception $e) {
            $response = array("status" => false, "code" => $e->getCode(), "mess" => ($e->getMessage()));
        } finally {
            return $response;
        }
    }

    public function adicaoRapida()
    {
        global $crud;
        global $postData;
        $response = [];
        $condicao = '';

        $tabela = $postData['tabela'];

        $condicao = $postData['condicao'];

        $conteudo = $postData['conteudo'];
        // unset($postData['condicao']);

        $coluna = array();
        $valor = array();

        try {
            // array_shift($postData);
            foreach ($conteudo as $valores) {
                $coluna[] = $valores[0];
                $valor[] = $valores[1];
            }
            
            print_r($coluna);
            session_start();


            // a condicao deve obeder a seguinte estrutura : ['col', val], [] x n .....]
            foreach ($condicao as $valor) {
                $cond = $valor[0] . ' = ' . $valor[1];

                if ($crud->count($tabela, $cond) > 0) {
                    throw new Exception(code: 1);
                }
                // echo $cond;
            }
            
            // if ($crud->count($tabela, $condiction) == 0) { // verifica se nao existe um ficheiro com o mesmo nome
                if ($crud->insert($tabela, $coluna, $valor) == false) { //verifica se a inserção foi bem sucedida
                    throw new Exception(code: 2);
                }
                    //         


            $response = array("status" => true);
        } catch (Exception $e) {
            $response = array("status" => false, "code" => $e->getCode(), "mess" => ($e->getMessage()));
        } finally {
            return $response;
        }
    }
}
