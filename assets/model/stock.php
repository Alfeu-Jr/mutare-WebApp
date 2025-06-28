<?php
include 'config.php';
include 'crud.php';
include 'request.php';


$crud = new crud();
$stock = new Stock();
$request = new Request();
$postData = [];

if (isset($_POST['request'])) {

    $postData = $stock->mysqliEscape($_POST);

    switch ($_POST['request']) {
        case 'stock_lista':
            $response = $stock->stock_lista();
            break;
            
        case 'dados_produto':
            $response = $stock->retornar_produto();
            break;

        // case 'detalhe':
        //     $response = $stock->detalhe();
        //     break;

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

class Stock
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
        global $crud;
        global $produto;

        $newArray = [];
        $condicao = "true";

        $postData = $produto->mysqliEscape($_POST);

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
            $searchQuery = " (produto_codigo like '%" . $searchValue . "%' or
                                    nome_produto like '%" . $searchValue . "%' or
                                    marca_produto like '%" . $searchValue . "%' or
                                    nome_categoria like '%" . $searchValue . "%' or
                                    nome_subcategoria like '%" . $searchValue . "%' or
                                    responsavel like '%" . $searchValue . "%') ";
            if (!empty($newArray)) {
                $searchQuery .= " and " . $searchQuery2;
            }
        } elseif (!empty($newArray)) {
            $searchQuery = $searchQuery2;
        }
                    $table ="(SELECT 
                        p.id AS produto_id,
                        p.codigo AS produto_codigo,
                        p.nome_produto,
                        p.marca_produto,
                        p.preco as preco_de_venda,
                        p.codigo_stock,
                        p.tipo_venda,
                        p.tipo_produto,
                        a.armazem AS nome_armazem,
                        COALESCE(ip.quantidade, 0) AS quantidade_estoque,
                        c.categoria AS nome_categoria,
                        p.subcategoria AS nome_subcategoria,
                        p.data_criacao AS produto_data_criacao
                    FROM 
                        mutare_solucoes.produto p
                        LEFT JOIN mutare_solucoes.item_produto ip ON p.id = ip.produto_id
                        LEFT JOIN mutare_solucoes.armazem a ON ip.armazem_id = a.id
                        LEFT JOIN mutare_solucoes.subcategoria s ON p.subcategoria = s.subcategoria
                        LEFT JOIN mutare_solucoes.categoria c ON s.categoria_id = c.id
                    WHERE 
                        p.activo = 1
                    ORDER BY 
                        p.nome_produto ASC,
                        a.armazem ASC) as T";      
        
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
                       <a class='me-2 edit-icon p-2 detalhe-produto' href='#' data-bs-toggle='modal' data-bs-target='#view-units' data-id={$response[$i]['produto_id']}>
														<i class='fa fa-eye' data-bs-toggle='tooltip' title='fa fa-eye'></i>
                                                        </a>
													<a class='me-2 p-2 alterar-produto' href='#' data-bs-toggle='modal' data-bs-target='#edit-units' data-id={$response[$i]['produto_id']}>
                                                        <i class='fa fa-edit' data-bs-toggle='tooltip' title='fa fa-edit'></i>
													</a>
                    </div>";
                // $cor = $response[$i]['activo'] == 1 ? 'badge-linesuccess' : 'badge-linedanger ';
                // $activo = $response[$i]['activo'] == 1 ? 'Activo' : 'Desactivado';

                // $estado = " <span class='badge {$cor}'>{$activo}</span>";

                // Verificar se as chaves existem e não são nulas
                if (isset($response[$i]) && !empty($response[$i])) {
                    $response[$i]['action'] = $action;
                    // $response[$i]['activo'] = $estado;
                    // $estado
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
        public function stock_lista()
    {
        global $crud;
        // $id = $_POST['id_produto'];
    
        session_start();
        // $userId = $_SESSION['user_id'];
        // $userFuncaoId = $_SESSION['funcao'];
        $response = [];
        // $file_response = '';
    
        // Colunas conforme seu SELECT principal de produto
        $collumns = 'p.nome_produto as produto, c.categoria, p.id as produto_id';
    
        $table = "produto p 
                left join categoria c on p.categoria_id = c.id";

        $produto_response = $crud->read($collumns, $table, "");

        // $grouped = [];
        foreach ($produto_response as $item) {
            $caso = $item['categoria'];
            $response[$caso][] = $item['produto'];
            $response[$caso][] = $item['produto_id'];
        }

        // print_r($response);
        

        //$response = $produto_response; // Se não houver arquivos, apenas os dados do produto
    
        if (count($response) > 0) {
            $response = array(
                "status" => true,
                "data" => $response
            );
        } else {
            $response = array("status" => false, "data" => "Nenhum registro encontrado");
        }
    
        return($response);
    }

    public function retornar_produto(){
        global $crud;
        global $postData;
        $tabela = 'produto p
                    left join categoria c on p.categoria_id = c.id';
        $condicao = '';

        $cond = [];
        
        $condicao = 'P.id = ' . $postData['id_produto'];

            $coluna = ' p.id AS produto_id,
                        p.codigo AS produto_codigo,
                        p.nome_produto,
                        p.marca_produto,
                        p.preco as preco_de_venda,
                        p.codigo_stock,
                        p.tipo_venda,
                        p.tipo_produto,
                        c.categoria';

        $response = $crud->read($coluna, $tabela, $condicao);
        
        if (count($response) > 0) {
            $response = array("status" => true, "data" => $response);
        } else {
            $response = array("status" => false, "data" => "Nenhum registro encontrado");
        }

        return $response;
    }
}