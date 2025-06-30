    <?php
include 'config.php';
include 'crud.php';
include 'request.php';


$crud = new crud();
$armazem = new armazem();
$request = new Request();
$postData = [];

if (isset($_POST['request'])) {

    $postData = $armazem->mysqliEscape($_POST);

    switch ($_POST['request']) {
        // case 'guardar':
        //     $response = $relatorio->guardar();
        //     break;
        case 'listar':
            $response = $armazem->listar();
            break;
            
        case 'adicionarr':
            $response = $request->adicaoRapida();
            break;

        case 'detalhe':
            $response = $armazem->detalhe();
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

class Armazem
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
        global $armazem;

        $newArray = [];
        $condicao = "true";

        $postData = $armazem->mysqliEscape($_POST);

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
                                    provincia_localizacao like '%" . $searchValue . "%' or
                                    rua_localizacao like '%" . $searchValue . "%' or
                                    bairro_localizacao like '%" . $searchValue . "%' or
                                    avenida_localizacao like '%" . $searchValue . "%' or
                                    responsavel like '%" . $searchValue . "%') ";
            if (!empty($newArray)) {
                $searchQuery .= " and " . $searchQuery2;
            }
        } elseif (!empty($newArray)) {
            $searchQuery = $searchQuery2;
        }

        // $table = "(SELECT r.id, r.centro, r.periodo, r.ano, r.date_insert, dr.descricao, dr.periodo as periodo_estatistico, s.sector, r.valido, r.filename as filename_padrao,
        //   (SELECT fr.documento_reconhecido FROM filename_relatorio fr WHERE fr.relatorio = r.id ORDER BY fr.id DESC LIMIT 1) as documento_reconhecido, 
        //   (SELECT fr.filename FROM filename_relatorio fr WHERE fr.relatorio = r.id ORDER BY fr.id DESC LIMIT 1) as filename, 
        //     (SELECT fr.localizacao_relatorio FROM filename_relatorio fr WHERE fr.relatorio = r.id ORDER BY fr.id DESC LIMIT 1) as localizacao_relatorio
        //     FROM relatorio r
        //         LEFT OUTER JOIN descricao_relatorio dr ON ( r.descricao = dr.id  )
        //             LEFT OUTER JOIN sector s ON ( r.sector = s.sector ) where {$condicao}) as T";

                    // $table = "(SELECT a.id, a.codigo, a.armazem, a.descricao, a.localizacao, a.responsavel, f.nome 
                    // FROM mutare_solucoes.armazem a 
                    // Left outer join mutare_solucoes.funcionario f ON ( a.responsavel = f.id  ) where {$condicao}) as T";

                    $table = "(SELECT a.id, a.armazem AS armazem, a.provincia_localizacao, a.responsavel, COUNT(p.id) AS total_produtos, SUM(ia.quantidade) AS stock_total, a.activo as activo,
                    rua_localizacao, bairro_localizacao, avenida_localizacao, a.contacto
                    FROM mutare_solucoes.armazem a 
                    LEFT OUTER JOIN mutare_solucoes.funcionario f ON a.responsavel = f.id 
                    LEFT OUTER JOIN mutare_solucoes.item_produto ia ON a.id = ia.armazem_id 
                    LEFT OUTER JOIN mutare_solucoes.produto p ON ia.produto_id = p.id where {$condicao}
                    GROUP BY a.id) as T";
        // $table = "(SELECT r.id, r.centro, r.periodo, r.ano, r.date_insert, dr.descricao, dr.periodo as periodo_estatistico, s.sector, r.valido, r.filename as filename_padrao,
        //   (SELECT fr.documento_reconhecido FROM filename_relatorio fr WHERE fr.relatorio = r.id ORDER BY fr.id DESC LIMIT 1) as documento_reconhecido,
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
                       <a class='me-2 edit-icon p-2 visualizar-armazem' href='#' data-bs-toggle='modal' data-bs-target='#view-units' data-id={$response[$i]['id']}>
														<i class='fa fa-eye' data-bs-toggle='tooltip' title='fa fa-eye'></i>
                                                        </a>
													<a class='me-2 p-2 alterar-armazem' href='#' data-bs-toggle='modal' data-bs-target='#edit-units' data-id={$response[$i]['id']}>
                                                        <i class='fa fa-edit' data-bs-toggle='tooltip' title='fa fa-edit'></i>
													</a>
                    </div>";
                $cor = $response[$i]['activo'] == 1 ? 'badge-linesuccess' : 'badge-linedanger ';
                $activo = $response[$i]['activo'] == 1 ? 'Activo' : 'Desactivado';

                $estado = " <span class='badge {$cor}'>{$activo}</span>";

                // Verificar se as chaves existem e não são nulas
                if (isset($response[$i]) && !empty($response[$i])) {
                    $response[$i]['action'] = $action;
                    $response[$i]['activo'] = $estado;
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
        global $postData;
        
        $id = $postData["id_armazem"];
        $response = "";
        
        session_start();
        
        $collumns = 'armazem, responsavel, contacto, provincia_localizacao, bairro_localizacao, avenida_localizacao, rua_localizacao, activo';
        $table = "armazem";
        
        $condition = "id LIKE '" . $id . "'";
        
        // echo($collumns. $table. $condition);
        
        try {
            $response = $crud->read($collumns, $table, $condition);
            // echo "<pre>";
            // print_r($response);
            if (count($response) > 0) {
                $response = array("status" => true, "data" => $response);
            } else {
                $response = array("status" => false, "code" => 1);
            }
        } catch (Exception $erro) {
            $response = array("status" => false, "code" => 2, "erro" => $erro->getMessage(), "msg" => $erro->getCode());
        } finally {
            return $response;
        }
    }
}