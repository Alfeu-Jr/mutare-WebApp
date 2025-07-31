<?php
include 'config.php';
include 'crud.php';

$crud = new crud();
$cliente = new Cliente();
$postData = [];

if (isset($_POST['request'])) {
    $postData = $cliente->mysqliEscape($_POST);

    switch ($_POST['request']) {
        case 'lista':
            $response = $cliente->listar();
            break;

        case 'adicionar_cliente':
            $response = $cliente->adicionar_cliente();
            break;

        case 'detalhe_cliente':
            $response = $cliente->detalhe_cliente();
            break;

        default:
            $response = [
                'status' => false,
                'message' => 'Ação não reconhecida ou não implementada.'
            ];
            break;
    }

    $GLOBALS['con']->close();

    echo json_encode($response);
    exit;
}

class Cliente
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

    public function listar()
    {
        // global $crud;
        // $colunas = "c.id, c.codigo, c.cliente, c.email, c.telefone, c.responsavel, c.contacto_responsavel, 
        //             c.provincia, c.endereco, c.descricao, c.estado, c.data_criacao";
        // $tabela = "cliente c";

        global $crud;
        global $relatorio;
        global $postData ;

        $newArray = [];
        $condicao = "true";
        // $postData = $relatorio->mysqliEscape($_POST);

        //transforma o array em uma unica string
        if (isset($postData['condicao'])) {
            foreach ($postData['condicao'] as $valor) {
                if (isset($valor[1])) {
                    $condi[] = "{$valor[0]} = '{$valor[1]}'";
                }
            }
            if (!empty($condi)) {
                $condicao = implode(' and ', $condi);
            }
        }

        // ler Valores
        $draw = $_POST["draw"];
        $row = $_POST["start"];
        $rowperpage = $_POST["length"]; // Linhas por página
        $columnIndex = isset($_POST['order'][0]['column']) ? $_POST['order'][0]['column'] : 0; // Coluna ordenada
        $columnName = $_POST['columns'][$columnIndex]['data']; // Nome da coluna
        $columnsortOrder = isset($_POST['order'][0]['dir']) ? $_POST['order'][0]['dir'] : '';
        $searchValue = $_POST['search']['value']; // Valor da pesquisa

        // Initialize an empty array to store the extracted data
        foreach ($_POST['columns'] as $index => $column) {
            $data = $column['data'];
            $valeu = $column['search']['value'];
            if ($valeu != '') {
                $valeu = str_replace("'", "''", $valeu);
                $newArray[] = "{$data} like '%{$valeu}%'";
            }
        }

        if (!empty($newArray)) {
            $searchQuery2 = "(" . implode(' and ', $newArray) . ")";
        }

        // Pesquisa
        $searchQuery = " 1";
        if ($searchValue != '') {
            $searchQuery = " (codigo like '%" . $searchValue . "%' or
                                    cliente like '%" . $searchValue . "%' or
                                    email like '%" . $searchValue . "%' or
                                    telefone like '%" . $searchValue . "%' or
                                    responsavel like '%" . $searchValue . "%' or
                                    provincia like '%" . $searchValue . "%' or
                                    endereco like '%" . $searchValue . "%' or
                                    descricao like '%" . $searchValue . "%') ";
            if (!empty($newArray)) {
                $searchQuery .= " and " . $searchQuery2;
            }
        } elseif (!empty($newArray)) {
            $searchQuery = $searchQuery2;
        }

        $table = "(SELECT c.id, c.codigo, c.cliente, c.email, c.telefone, c.responsavel, c.contacto_responsavel, 
        DATE_FORMAT(c.data_registro, '%d-%m-%Y') as data_registro, c.provincia, c.endereco, c.descricao, c.estado
            FROM 
                cliente c
                where {$condicao}) as T";

        // Contagem total de registros sem filtros
        $totalRecords = $crud->count($table, true);
        //resultado sem filtros
        $totalResponse = $crud->readDataTable('', $table, '');

        // Contagem total de registros com filtros
        $totalRecordwithFilter = $crud->count($table, $searchQuery);

        //Resultados
        $condicao2 = $searchQuery . ' order by ' . $columnName . ' ' . $columnsortOrder . ' limit ' . $row . ',' . $rowperpage;

        $response = $crud->readDataTable("", $table, $condicao2);

        $len = 0;
        if ($response != null) {
            $len = count($response);
        }

        if ($len > 0) {
            for ($i = 0; $i < $len; $i++) {
                // Botão que permite visualizar os detalhe
                $action = "<div class='edit-delete-action'>
													<a class='me-2 p-2' href='#' data-bs-toggle='modal' data-bs-target='#edit-units' data-id='{$response[$i]['id']}'>
														<i data-feather='eye' class='feather-eye'></i>
													</a>";
												// 	<a class='confirm-text p-2' href='javascript:void(0);'>
												// 		<i data-feather='trash-2' class='feather-trash-2'></i>
												// 	</a>
												// </div>";
                                                // <div class='edit-delete-action'>
                    //    <a class='me-2 edit-icon p-2 visualizar-entrada' href='#' data-bs-toggle='modal' data-bs-target='#view-units' data-id={$response[$i]['id']}>
					// 									<i class='fa fa-eye' data-bs-toggle='tooltip' title='fa fa-eye'></i>
                    //                                     </a>
					// 								<a class='me-2 p-2 alterar-entrada' href='#' data-bs-toggle='modal' data-bs-target='#edit-units' data-id={$response[$i]['id']}>
                    //                                     <i class='fa fa-edit' data-bs-toggle='tooltip' title='fa fa-edit'></i>
					// 								</a>
                    // </div>
                   
               
                // $action = $viewButton;

                // Verificar se as chaves existem e não são nulas
                if (isset($response[$i]) && !empty($response[$i])) {
                    $response[$i]['action'] = $action;
                }
            }
        }

        ## Response
        $response = array(
            "draw" => intval($draw),
            "iTotalRecords" => $totalRecords,
            "iTotalDisplayRecords" => $totalRecordwithFilter,
            "aaData" => $response,
            "totalResponse" => $totalResponse
        );
        // print_r($response);
        return $response;
    }

    public function adicionar_cliente()
    {
        global $crud;
        $dados = [
            "codigo" => $_POST['codigo'] ?? '',
            "nome" => $_POST['nome'] ?? '',
            "email" => $_POST['email'] ?? '',
            "telefone" => $_POST['telefone'] ?? '',
            "responsavel" => $_POST['responsavel'] ?? '',
            "contacto_responsavel" => $_POST['contacto_responsavel'] ?? '',
            "provincia_id" => $_POST['provincia'] ?? null,
            "endereco" => $_POST['endereco'] ?? '',
            "descricao" => $_POST['descricao'] ?? '',
            "estado" => 1,
            "criado_por" => $_SESSION['user_id'] ?? null
        ];

        // Verifica se já existe email
        $existe = $crud->read("id", "cliente", "email = '{$dados['email']}'");
        if ($existe && count($existe) > 0) {
            return [
                "status" => false,
                "message" => "Já existe um cliente com este email."
            ];
        }

        $colunas = array_keys($dados);
        $valores = array_values($dados);

        $result = $crud->insert("cliente", $colunas, $valores);

        if ($result === true) {
            return [
                "status" => true,
                "message" => "Cliente registrado com sucesso!"
            ];
        } else {
            return [
                "status" => false,
                "message" => "Erro ao registrar cliente: $result"
            ];
        }
    }

    public function detalhe_cliente()
    {
        global $crud;
        $id = $_POST['id'] ?? 0;
        $colunas = "id, codigo, nome, email, telefone, responsavel, contacto_responsavel, provincia_id, endereco, descricao, estado, data_registro";
        $cliente = $crud->read($colunas, "cliente", "id = $id");

        if ($cliente && count($cliente) > 0) {
            return [
                "status" => true,
                "data" => $cliente[0]
            ];
        } else {
            return [
                "status" => false,
                "message" => "Cliente não encontrado."
            ];
        }
    }
}