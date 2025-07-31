import { selectFiller } from './master.js';
import { Lista } from './master.js';
class listaProduto extends Lista {
    constructor(){
		//   console.log('ano') 
    super();
		self = this;
		this.init();
    }

    init(){ 
      self = this;
   
    this.nomeTabela = "tabela_produto";
    this.url = "assets/model/produto.php";

    this.colunas = ['nome_produto',
      'codigo_unidade',
      'nome_categoria',
      'marca_produto',
      'preco_de_venda',
      'tipo_venda',
      'quantidade_estoque',
      'action'];

    this.sort = [0, "desc"];

    this.dataRequest = {
      request: "listar",
    };

    this.notOrderable = [7];
    this.collumnFilter = [2, 3, 4];

    this.lista();

    $(this.tabela)
    .find("tr")
    .each(function () {
      $(this).find("td:last").addClass("action-table-data");
    });

        self.tabela.on('draw', function() {
          if (window.feather) {
            feather.replace();
          }
    // 
  });

    
    // $('#tabela_produto').on('click', '.detalhe-produto', function () {
    //   var id = $(this).data('id');
    //   window.open("product-details.html?id_produto=" + id, "_self");

    // });
    }
}

class adicionarProduto extends selectFiller {
    constructor(){
        super();
        self = this;
        this.init();
    }

    async init(){
        await this.getSelect('categoria', 'slc_categoria', ['categoria', 'id', 'id']);
        await this.getSelect('subcategoria', 'txt_subcategoria', ['subcategoria', 'subcategoria', 'id']);

        $('#submeter-adicionar-categoria').on('click', function () {
          $("#txt_nova_categoria").val().trim().length > 0 ? self.guardar_categoria() : true;
        });

        this.codigo_unidade();

        $('#btn_gerar_codigo').on('click', function(e) {
          self.codigo_unidade();
        }); 
        
        this.formcheck();
        $(".js-select2-tags").select2({
          tags: true
        });

        $('#slc_tipovenda').on('change', function() {
          var $embalagemDiv = $('.venda-embalagem');
          if ($(this).val() === 'Embalagem') {
            $embalagemDiv.removeClass('d-none');
          } else {
            $embalagemDiv.addClass('d-none');
          }
        });
      }

      codigo_unidade() {
        const now = new Date();
        const microseconds = now.getTime() * 150 + Math.floor(now.getMilliseconds() * 110);
        $('#txt_codigo_unidade').val(String(microseconds).slice(-12).padStart(12, '1'));
      }
    
      
formcheck() {
  self = this;
  $("#form_adicionarproduto").on("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Bootstrap validation
    if (this.checkValidity() === false) {
      $(this).addClass("was-validated");
      return;
    }

    // Captura dos dados

    self.adicionar_produto();
    // Exemplo: exibir no console
    // console.log(dados);

    // Aqui você pode enviar via AJAX ou outro processamento
  });
}

    fselecgetSelect(tabela, elementoId, keys) {
        let self = this;
        return new Promise((resolve, reject) => {
            var element = document.getElementById(elementoId);
            // console.log(document.getElementById('slc_armazem'));
            $.ajax({
                url: 'assets/model/request.php',
                type: 'post',
                data: { request_geral: 'listar_slc', tabela: tabela },
                dataType: 'json',
                success: function (response) {
                    self.fillSelect(element, response, keys);
                    resolve();
                },
                error: function (error) {
                    reject(error);
                }
            })
        });
      }

guardar_categoria() {
    self = this;
    var dadosCategoria = new FormData();

    function pushData(key, value) {
      const valor = value ?? ""; // Use nullish coalescing operator for cleaner code
      dadosCategoria.append(key, valor);
    }

    function request(dados) {
      $.ajax({
        url: 'assets/model/categoria.php',
        type: "post",
        data: dados,
        dataType: "JSON",
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.status == true) {
            // Swal.fire({
            //   icon: "success",
            //   title: "Registrar o Centro",
            //   html: "O centro foi guardado com sucesso!",
            //   allowEscapeKey: false,
            //   allowOutsideClick: false,
            //   confirmButtonText: "OK",
            //   preConfirm: () => {
            //     $('#modal_novo_centro').modal('hide');
            //     self.tabela.ajax.reload();
            //   }
            // });
            $('#modal-adicionar-categoria').modal('hide')
          // Refresh Select2 remote data
            $('#slc_categoria').val('').trigger('change'); // Clear selection
            $('#slc_categoria').select2('close'); // Close dropdown if open
            $('#slc_categoria').select2('open');  // Re-open to trigger AJAX reload
          }

          if (response.status == false) {
            console.error("Unknown error code:", response.code);
            switch (response.code) {
              case 2:
                console.log(response.code);
                Swal.fire({
                  icon: "warning",
                  title: "Erro ao Registrar o Centro",
                  html: 'Nome de Ficheiro <b>Inválido</b> <p></p> Altere o <b>nome do ficheiro</b> e tente novamente</p>'
                });
                break;
              case 1:
                // modal-categoria-duplicada
                $('#modal-categoria-duplicada').modal('show');
              break;;
              case 3:
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Registrar o Centro",
                  html: errorMessage
                });
                break;
              default:
                $('#modal-categoria-erro').modal('show')
                console.error("Unknown error code:", response.code);
            }
          }
        },
        error: function (response) {
          $('#modal-categoria-erro').modal('show');
          console.log('Erro no sistemaa, Erro - ',response.responseText);
        }
      });
    }

    pushData("request", 'guardar');
    // pushData("conteudo", [["categoria", $("#txt_nova_categoria").val()]]);
    // pushData("condicao", [['categoria', $("#txt_nova_categoria").val()]]);
    pushData("categoria", $("#txt_nova_categoria").val());
    // pushData("provincia", $("#slc_provincia").val());
    // pushData("distrito", $("#txt_distrito").val());

    request(dadosCategoria);
  }


adicionar_produto() {
  self = this;
  var dadosProduto = new FormData();

  function pushData(key, value) {
      const valor = value ?? "";
      dadosProduto.append(key, valor);
  }

  function request(dados) {
      $.ajax({
          url: "assets/model/request.php",
          type: "post",
          data: dados,
          dataType: "JSON",
          processData: false,
          contentType: false,
          success: function (response) {
              if (response.status == true) {
                  Swal.fire({
                      icon: "success",
                      title: "Produto Registrado",
                      html: "O produto foi guardado com sucesso!",
                      allowEscapeKey: false,
                      allowOutsideClick: false,
                      confirmButtonText: "OK",
                      preConfirm: () => {
                        document.getElementById("form_adicionarproduto").reset();
                          location.reload();
                          // $('#form_adicionarproduto')[0].reset();
                          // $('#form_adicionarproduto').removeClass('was-validated');
                          // Atualize sua tabela/lista de produtos se necessário
                      }
                  });
              }
              if (response.status == false) {
                  console.error("Unknown error code:", response.code);
                  switch (response.code) {
                      case 2:
                          Swal.fire({
                              icon: "warning",
                              title: "Erro ao Registrar o Produto",
                              html: "Nome de ficheiro <b>inválido</b>. <br> Altere o <b>nome do ficheiro</b> e tente novamente.",
                          });
                          break;
                      case 1:
                          Swal.fire({
                              icon: "error",
                              title: "Nome já registrado",
                              text: "Já existe um produto cadastrado com este nome. Por favor, escolha outro nome.",
                          });
                          break;
                      case 3:
                          Swal.fire({
                              icon: "error",
                              title: "Erro ao Registrar o Produto",
                              html: errorMessage,
                          });
                          break;
                      default:
                          Swal.fire({
                              icon: "error",
                              title: "Erro ao Registrar o Produto",
                              html: "Ação não reconhecida ou não implementada. Por favor, tente novamente ou contacte o administrador do sistema.",
                          });
                          console.error("Unknown error code:", response.mess);
                  }
              }
          },
          error: function (response) {
              Swal.fire({
                  icon: "error",
                  title: "Erro ao Registrar o Produto",
                  html:
                      "Por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente." +
                      "<p></p> Se o erro persistir, contacte o Administrador do Sistema para resolver o problema.",
              });
              console.log("Erro no sistema, Erro - ", response.responseText);
          },
      });
  }

  pushData("request_geral", "adicionar");

  const campos = [
      // "armazem",
      "nome_produto",
      "marca_produto",
      "categoria_id",
      "subcategoria",
      "tipo_venda",
      "codigo_unidade",
      "descricao",
      "quantidade",
      "preco",
      "peso",
      "quantidade_alerta",
      "medida"
      // "data_fabricacao",
      // "validade"
  ];
  const valores = [
      // $("#slc_armazem").val(),
      $("#txt_nomeproduto").val().trim(),
      $("#txt_marcaproduto").val().trim(),
      $("#slc_categoria").val().trim(),
      $("#txt_subcategoria").val().trim(),
      $("#slc_tipovenda").val().trim(),
      $("#txt_codigo_unidade").val().trim(),
      $("#txt_descricao").val().trim(),
      $("#txt_quantidade_embalagem").val().trim(),
      $("#txt_preco").val().replace(',', '.').trim(),
      $("#txt_peso").val().trim(),
      $("#txt_quantidaalerta").val().trim(),
      $("#slc_medida").val().trim()
      // $("#txt_datafabricacao").val(),
      // $("#txt_validade").val()
  ];

  campos.forEach(function (campo, index) {
    const valor = valores[index];
    if (valor !== undefined && valor !== null && valor !== "") {
        pushData("coluna[]", campo);
        pushData("valores[]", valor);
    }
});

  // Exemplo de condicao: ["nome_produto", $("#txt_nomeproduto").val()]
  const condicao = [
      ["nome_produto", $("#txt_nomeproduto").val()],
      ["marca_produto", $("#txt_marcaproduto").val()]
  ];

  condicao.forEach(function (condition, index) {
      dadosProduto.append(`condicao[${index}][]`, condition[0]);
      dadosProduto.append(`condicao[${index}][]`, condition[1]);
  });

  pushData("tabela", "produto");

  request(dadosProduto);
}



}

class detalheProduto{
  constructor(idProduto) {
    // super();
    this.id_produto = idProduto;
    this.dados_produto;

    // this.preencherselect();

    self = this;

    // this.init();
    // this.formvalidation();
    this.carregarProduto(idProduto);
  }

  async carregarProduto(id_produto) {
    self = this;

    try {
      await $.ajax({
        url: "assets/model/produto.php",
        method: "POST",
        data: { request: 'detalhe', id_produto: id_produto },
        dataType: "json",

        success: function (response) {
          if (response.status == true) {
            self.dados_produto = response.data;

            $('#txt_nome_produto').text(response.data.nome_produto);
            $('#txt_categoria').text(response.data.nome_categoria);
            $('#txt_subcatgoria').text(response.data.nome_subcategoria);
            $('#txt_marca').text(response.data.marca_produto);
            $('#txt_unidade').text(response.data.produto_unidade);
            $('#txt_codigo_stock').text(response.data.produto_codigo);
            $('#txt_quantidade_minima').text(response.data.quantidade_minima_alerta);
            $('#txt_quantidade').text(response.data.quantidade_estoque);
            // $('#txt_imposto').text(response.data.filename);
            // $('#txt_desconto').text(response.data.id);
            $('#txt_preco').text(response.data.produto_preco);

            $('#txt_estado').text(response.data.produto_estado);
            $('#txt_descricao').text(response.data.produto_descricao);
            
            //Secção dos fotos 

            // ficheiro = "arquivos/produto/" + response.data.localizacao_produto + "/" + response.data.filename;

            // //verifica se o formato do ficheiro é compatível
            // if((response.data.filename.toLowerCase()).includes('.pdf')){
            //   $('#ficheiro_produto').attr('src', ficheiro);
            //   $('#ver_ficheiro').attr('href', ficheiro);
            // }else{
            //   $('.ficheiro-compativel').each(function () {
            //     $(this).addClass("d-none");
            //   });
            //   $('.ficheiro-incompativel').removeClass("d-none");
            // }

          }

        },
        erro: function (response) {
          Swal.fire({
            icon: "error",
            title: "Detalhes do Produto",
            html: "Ocorreu um erro ao carregar os dados do produto, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente."
        });
        console.log("Erro no sistema, Erro - ", response.responseText);
        }
      });
    } catch (error) {
      console.error(error.responseText);
      // console.log("Erro no sistema, Erro - ", response.responseText);
    }
  }

}

// $(document).ready(function () {
    document.addEventListener("DOMContentLoaded", function() {
	const dataMdulo = $('#produtojs').data('modulo');

 if(dataMdulo == 'produto-lista'){
    const listaP = new listaProduto();
 } else if(dataMdulo == 'produto-adicionar'){
     const listaP = new adicionarProduto();
    } else if(dataMdulo == 'produto-detalhe'){
      var url = new URLSearchParams(window.location.search);
      const idProduto = (url.get('id_produto')).replace(/'/g, '');
      // console.log(idProduto)
        const detalheP = new detalheProduto(idProduto);
    }
    
});