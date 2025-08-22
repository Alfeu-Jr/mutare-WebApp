<?php
include 'config.php';
include 'crud.php';
include 'request.php';


$crud = new crud();
$produto = new produto();
$request = new Request();
$postData = [];

if (isset($_POST['request'])) {

    $postData = $produto->mysqliEscape($_POST);

    switch ($_POST['request']) {
        // case 'guardar':
        //     $response = $relatorio->guardar();
        //     break;
        case 'listar':
            $response = $produto->listar();
            break;
            
        case 'adicionarr':
            $response = $request->adicaoRapida();
            break;

        case 'detalhe':
            $response = $produto->detalhe();
            break;

        // case 'descricao_slc':
        //     $response = $relatorio->listarDescricao();
        //     break;

        // case 'listar_slc':
        //     $response = $request->listarSlc();
        //     break;

        // case 'actualizar_relatorio':
        //     $response = $relatorio->actualizarRelatorio();
        //     break;

        // case 'actualizar_ficheiro_relatorio':
        //     $response = $relatorio->actualizarFicheiroRelatorio();
        //     break;

        // case 'grelha':
        //     $response = $relatorio->grelhaSector();
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

class Produto
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
                                    nome_subcategoria like '%" . $searchValue . "%') ";
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
                        p.codigo_unidade,
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
                    <a class='me-2 edit-icon p-2 detalhe-produto' href='product-details.html?id_produto={$response[$i]['produto_id']}' data-id='{$response[$i]['produto_id']}'>
														<i data-feather='eye' class='action-eye'></i>
													</a>
                                                    <a class='me-2 edit-icon p-2 detalhe-produto' href='product-details.html?id_produto={$response[$i]['produto_id']}' data-id='{$response[$i]['produto_id']}'>
														<i data-feather='database'></i>
													</a>
                                                    <a class='confirm-text p-2' href='javascript:void(0);' data-bs-target='#block-units' data-id='{$response[$i]['id']}'>
									<i data-feather='trash-2' class='feather-trash-2'></i>
								</a>
                    </div>";
                // <a class='confirm-text p-2 apagar-produto' href='javascript:void(0);' data-id='{$response[$i]['produto_id']}'>
				// 										<i data-feather='trash-2' class='feather-trash-2'></i>
				// 									</a>
               
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
        public function detalhe()
    {
        global $crud;
        $id = $_POST['id_produto'];
    
        session_start();
        // $userId = $_SESSION['user_id'];
        // $userFuncaoId = $_SESSION['funcao'];
        $response = "";
        // $file_response = '';
    
        // Colunas conforme seu SELECT principal de produto
        $collumns = ' p.nome_produto,
    c.categoria AS nome_categoria,
    p.subcategoria AS nome_subcategoria,
    p.marca_produto,
    p.unidade_medida AS produto_unidade,
    p.codigo_unidade AS produto_codigo,
    p.quantidade_alerta as quantidade_minima_alerta,
    COALESCE(ip.quantidade, 0) AS quantidade_estoque,
    p.preco AS produto_preco,
    p.activo AS produto_activo,
    p.descricao AS produto_descricao';
    
        $table = "mutare_solucoes.produto p
            LEFT JOIN mutare_solucoes.item_produto ip ON p.id = ip.produto_id
            LEFT JOIN mutare_solucoes.categoria c ON p.categoria_id = c.id";
    
        $condition = "p.id = '" . $id . "'";
    
        $produto_response = $crud->read($collumns, $table, $condition);
    
        // Se houver arquivos associados ao produto, adapte conforme sua estrutura
        // Exemplo:
        // $file_response = $crud->read('documento_reconhecido, filename', 'arquivo_produto', "produto_id = '" . $id . "' order by id desc limit 1");
    
        // $response = array_merge($produto_response, $file_response);
    
        $response = $produto_response; // Se não houver arquivos, apenas os dados do produto
    
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

    // public function detalhe()
    // {
    //     global $crud;
    //     global $postData;
        
    //     $id = $postData["id_produto"];
    //     $response = "";
        
    //     session_start();
        
    //     $collumns = 'produto, responsavel, contacto, provincia_localizacao, bairro_localizacao, avenida_localizacao, rua_localizacao, activo';
    //     $table = "produto";
        
    //     $condition = "id LIKE '" . $id . "'";
        
    //     // echo($collumns. $table. $condition);
        
    //     try {
    //         $response = $crud->read($collumns, $table, $condition);
    //         // echo "<pre>";
    //         // print_r($response);
    //         if (count($response) > 0) {
    //             $response = array("status" => true, "data" => $response);
    //         } else {
    //             $response = array("status" => false, "code" => 1);
    //         }
    //     } catch (Exception $erro) {
    //         $response = array("status" => false, "code" => 2, "erro" => $erro->getMessage(), "msg" => $erro->getCode());
    //     } finally {
    //         return $response;
    //     }
    // }
}