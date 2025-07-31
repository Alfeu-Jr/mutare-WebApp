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
            
        case 'lista':
        $response = $stock->listar();
        break;

        case 'dados_produto':
            $response = $stock->retornar_produto();
            break;

        case 'adicionar_stock':
            $response = $stock->adicionar_stock();
            break;

         case 'detalhe':
            $response = $stock->detalhes_stock();
            break;
            
        case 'lista_produtos_stock':
            $response = $stock->lista_produtos_stock();
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
                left outer join categoria c on p.categoria_id = c.id";

        $produto_response = $crud->read($collumns, $table, "");

        // $grouped = [];
        // print_r($produto_response);
        if (isset($produto_response['produto'])) {
            // Handle single product case
            $caso = $produto_response['categoria'];
            $response[$caso][] = [$produto_response['produto_id'],$produto_response['produto']];
            // $response[$caso][] = $produto_response['produto_id'];
        } else {
            foreach ($produto_response as $item) {
                $caso = $item['categoria'];
                $response[$caso][] = [$item['produto'], $item['produto_id']];
                // $response[$caso][] = $item['produto_id'];
            }
        }
        if (count($response) > 0) {
            $response = array(
                "status" => true,
                "data" => $response
            );
        } else {
            $response = array("status" => false, "data" => "Nenhum registro encontrado");
        }

        return ($response);
    }

    public function retornar_produto()
    {
        global $crud;
        global $postData;
        $tabela = 'produto p
                    left join categoria c on p.categoria_id = c.id';
        $condicao = '';

        $cond = [];

        $condicao = 'p.id = ' . $postData['id_produto'];

        $coluna = ' p.id AS produto_id,
                        p.codigo AS produto_codigo,
                        p.nome_produto,
                        p.marca_produto,
                        p.preco as preco_de_venda,
                        p.codigo_unidade,
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

    public function adicionar_stock()
    {
        global $crud;
        global $postData;
        $response = [];

        $tabela = 'entrada';
        $tabelaStock = 'item_entrada_stock';

        // $codigo = uniqid();
        $lote = 'LOTE-' . date('Ymd') . '-' . uniqid();

        $produtos = $postData['produtos'];
        $quantidades = $postData['quantidades'];

        $coluna[] = 'data_entrada';
        $valor[] = $postData['data_entrada'] ?? date('Y-m-d H:i:s');

        $coluna[] = 'lote';
        $valor[] = $lote;

        $coluna[] = 'armazem_id';
        $valor[] = $postData['armazem_id'];

        // $coluna[] = 'responsalvel';
        // $valor[] = $_SESSION['user_id'];

        try {
            // Se não houver produtos ou quantidades, retorna erro
            // echo("Produtos: " . count($produtos) . ", Quantidades: " . count($quantidades));

            if ((count($produtos) == 0) || (count($produtos) != count($quantidades))) {
                throw new Exception(code: 1);
            }

            if ($crud->insert($tabela, $coluna, $valor) != true) {
                throw new Exception(code: 2);
            }
            foreach ($produtos as $index => $produto_id) {
                // echo "Produto ID: {$produto_id}, Quantidade: {$quantidades[$index]}<br>";
                // Verifica se a quantidade existe no array, se não existir, define como 0
                // $quantidade = isset($quantidades[$index]) ? $quantidades[$index] : 0;
                $quantidade = $quantidades[$index];
            
                // Initialize arrays for each iteration
                $colunaStock = [];
                $valorStock = [];
            
                $colunaStock[] = 'codigo_lote';
                $valorStock[] = $lote;
            
                $colunaStock[] = 'produto_id';
                $valorStock[] = $produto_id;
            
                $colunaStock[] = 'quantidade';
                $valorStock[] = $quantidade;
                // print_r($colunaStock);
                // print_r($valorStock);
            
                if ($crud->insertMultiple($tabelaStock, $colunaStock, $valorStock) != true) {
                    throw new Exception(code: 3);
                }
                // echo "`Produto ID: {$produto_id}, Quantidade: {$quantidade} registrada com sucesso!<br>";
            }

            $response = [
                "status" => true,
                "message" => "Stock registrado com sucesso!"
            ];
            echo json_encode($response);
            exit;
        } catch (Exception $e) {
            $response = array("status" => false, "code" => $e->getCode(), "mess" => ($e->getMessage()));
        } finally {
            return $response;
        }
    }

    public function detalhe_stock()
    {
        global $crud;
        global $postData;
        // $tabela = 'produto p
        //             left join categoria c on p.categoria_id = c.id';

        // $condicao = $postData['id'] ?? $id;

        // $cond = [];
        global $crud;


        $coluna = "e.id,
                    ar.armazem,
                    DATE_FORMAT(e.data_entrada, '%d-%m-%Y') as data_entrada,
                    e.responsavel as responsavel_registro,
                    CONCAT(SUBSTRING(e.lote, 15, 30)) as codigo_lote,
                    SUM(ies.quantidade) as quantidade";

        $tabela = 'entrada e
                    left join armazem ar on e.armazem_id = ar.id
                    left join item_entrada_stock ies on e.lote = ies.codigo_lote
                    left join produto p on ies.produto_id = p.id';

        $condicao = "e.id = {$postData['id_stock']}";

        $response = $crud->read($coluna, $tabela, $condicao);

        if (count($response) > 0) {
            return array("status" => true, "data" => $response);
        } else {
            return array("status" => false, "data" => "Nenhum registro encontrado");
        }
    }
    /**
     * Listar entradas de stock
     * 
     * @return array
     */
    
    public function listar()
    {
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
            $searchQuery = " (armazem like '%" . $searchValue . "%' or
                                    data_entrada like '%" . $searchValue . "%' or
                                    responsavel_registro like '%" . $searchValue . "%' or
                                    codigo_lote like '%" . $searchValue . "%' or
                                    produto like '%" . $searchValue . "%') ";
            if (!empty($newArray)) {
                $searchQuery .= " and " . $searchQuery2;
            }
        } elseif (!empty($newArray)) {
            $searchQuery = $searchQuery2;
        }
        
                // e.data_entrada,
                // LEFT(STR_TO_DATE(e.data_entrada, '%d-%m-%Y'), ) as data_entrada,
 
        $table = "(SELECT e.id,
                ar.armazem,
                DATE_FORMAT(e.data_entrada, '%d-%m-%Y') as data_entrada,
                e.responsavel as responsavel_registro,
                CONCAT(SUBSTRING(e.lote, 15, 30)) as codigo_lote,
                CONCAT(SUBSTRING(GROUP_CONCAT(p.nome_produto SEPARATOR ', '), 1, 20), '...') as produtos,
                CONCAT(SUBSTRING(GROUP_CONCAT(p.nome_produto SEPARATOR ', '), 1, 47), '...') as produto,
                sum(ies.quantidade) as quantidade
            FROM 
                mutare_solucoes.entrada e
            LEFT OUTER JOIN armazem ar ON e.armazem_id = ar.id
                LEFT OUTER JOIN mutare_solucoes.item_entrada_stock ies ON e.lote = ies.codigo_lote
            LEFT OUTER JOIN mutare_solucoes.produto p ON ies.produto_id = p.id
                where {$condicao}
            GROUP BY e.lote ORDER BY e.data_entrada DESC) as T";

                    // LEFT OUTER JOIN sector s ON ( r.sector = s.sector ) where {$condicao}) as T";
        // echo $table;

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
								<a class='me-2 p-2 visualizar-entrada' href='#' data-bs-toggle='modal' data-bs-target='#edit-units' data-id='{$response[$i]['id']}'>
									<i data-feather='eye' class='feather-eye'></i>
								</a>
								<a class='confirm-text p-2' href='javascript:void(0);' data-bs-target='#block-units' data-id='{$response[$i]['id']}'>
									<i data-feather='trash-2' class='feather-trash-2'></i>
								</a>
							</div>";
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

    public function detalhes_stock(){
        global $stock;
        $response = [];
        $detalhe_stock = [];
        $detalhe_stock = $stock -> detalhe_stock();
        // $lista_stock = $stock -> lista_produtos();
        
        if(isset($detalhe_stock['data']) && $detalhe_stock['status'] != false) {
            $response["detalhe_stock"] = $detalhe_stock['data'];
        }
        
        // if(isset($lista_stock['data']) && $lista_stock['status'] != false) {
        //     $response["lista_stock"] = $lista_stock['data'];
        // }

        // if (count($stock1) > 0) {
        //     // return array("detalhe_stock" => $response);
        //     $response["detalhe_stock"] = $stock1['data'];
        // } else {
        //     return array("data" => "Nenhum registro encontrado");
        // }
        // if (count($stock1) > 0) {
        //     // return array("detalhe_stock" => $response);
        //     $response["detalhe_stock"] = $stock1['data'];
        // }
        if (count($response) > 0) {
            return array("status" => true, "data" => $response);
        } else {
            return array("status" => false, "data" => "Nenhum registro encontrado");
        }
    }

    public function lista_produtos_stock(){

        global $crud;
        global $postData ;

        $newArray = [];
        $condicao = "true";

        // transforma o array em uma unica string
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
            $searchQuery = " (nome_produto like '%" . $searchValue . "%' or
                                    categoria like '%" . $searchValue . "%' or
                                    codigo_unidade like '%" . $searchValue . "%') ";
            if (!empty($newArray)) {
                $searchQuery .= " and " . $searchQuery2;
            }
        } elseif (!empty($newArray)) {
            $searchQuery = $searchQuery2;
        }

        $tabela = "(SELECT k.id, k.codigo_lote, k.produto_id, k.quantidade, k.preco_unitario, k.valor_total, k.lote, k.data_validade, k.data_registro,
		    pr.nome_produto, c.categoria, pr.subcategoria, pr.codigo_unidade
            FROM
                mutare_solucoes.item_entrada_stock k
            left join mutare_solucoes.entrada e on (e.lote = k.codigo_lote)
            left join mutare_solucoes.produto pr on (pr.id = k.produto_id)
            left outer join mutare_solucoes.categoria c on (pr.categoria_id = c.id)
            where e.id = '{$postData['id_stock']}') as T";

        // echo $table;
        // Contagem total de registros sem filtros
        $totalRecords = $crud->count($tabela, true);
        //resultado sem filtros
        $totalResponse = $crud->readDataTable('', $tabela, '');
        // Contagem total de registros com filtros
        $totalRecordwithFilter = $crud->count($tabela, $searchQuery);

        //Resultados
        $condicao2 = $searchQuery . ' order by ' . $columnName . ' ' . $columnsortOrder . ' limit ' . $row . ',' . $rowperpage;
        $records = $crud->readDataTable("", $tabela, $condicao2);

        $len = 0;
        if ($totalResponse != null) {
            $len = count($records);
        }

        // if ($len > 0) {
        //     for ($i = 0; $i < $len; $i++) {
        //         // Botão que permite visualizar os detalhe
        //         $action = "<div class='edit-delete-action'>
		// 						<a class='me-2 p-2 visualizar-entrada' href='#' data-bs-toggle='modal' data-bs-target='#edit-units' data-id='{$records[$i]['id']}'>
		// 							<i data-feather='eye' class='feather-eye'></i>
		// 						</a>
		// 						<a class='confirm-text p-2' href='javascript:void(0);' data-bs-target='#block-units' data-id='{$records[$i]['id']}'>
		// 							<i data-feather='trash-2' class='feather-trash-2'></i>
		// 						</a>
		// 					</div>";
        //         // Verificar se as chaves existem e não são nulas
        //         if (isset($records[$i]) && !empty($records[$i])) {
        //             $records[$i]['action'] = $action;
        //         }
        //     }
        // }
        ## Response
        $response = array(
            "draw" => intval($draw),
            "iTotalRecords" => $totalRecords,
            "iTotalDisplayRecords" => $totalRecordwithFilter,
            "aaData" => $records,
            "totalResponse" => $totalResponse
        );
        return $response;
    }

    public function __destruct()
    {
        // Destrutor da classe Stock
        // Pode ser usado para liberar recursos, fechar conexões, etc.
    }
}
