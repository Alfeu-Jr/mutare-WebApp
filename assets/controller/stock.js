import { selectFiller } from "./master.js";
import { Lista } from "./master.js";
class listaProduto extends Lista {
  constructor() {
    //   console.log('ano')
    super();
    self = this;
    this.init();
  }

  init() {
    //   console.log('ano')
    // Datatable

    // if($('.datatable-new').length > 0) {
    //   $('.datatable-new').DataTable({
    //     "bFilter": true,
    //     "sDom": 'fBtlpi',
    //     "ordering": true,
    //     "language": {
    //       search: ' ',
    //       sLengthMenu: '_MENU_',
    //       searchPlaceholder: "Search",
    //       info: "_START_ - _END_ of _TOTAL_ items",
    //       paginate: {
    //         next: ' <i class=" fa fa-angle-right"></i>',
    //         previous: '<i class="fa fa-angle-left"></i> '
    //       },
    //     },
    //     initComplete: (settings, json)=>{
    //       $('.dataTables_filter').appendTo('#tableSearch');
    //       $('.dataTables_filter').appendTo('.search-input');
    //     },
    //   });
    // }

    self = this;

    this.nomeTabela = "tabela_produto";
    this.url = "assets/model/produto.php";

    this.colunas = [
      "nome_produto",
      "codigo_stock",
      "nome_categoria",
      "marca_produto",
      "preco_de_venda",
      "tipo_venda",
      "quantidade_estoque",
      "action",
    ];

    this.sort = [0, "desc"];

    this.dataRequest = {
      request: "listar",
    };

    this.notOrderable = [7];
    this.collumnFilter = [2, 3, 4];

    this.lista();

    $("#tabela_produto").on("click", ".detalhe-produto", function () {
      var id = $(this).data("id");
      window.open("product-details.html?id_produto=" + id, "_self");
    });
  }
}

class adicionarStock extends selectFiller {
  constructor() {
    super();
    self = this;
    this.init();
    this.carregarStock();

    this.stockIds = [];
    this.stockQuantities = [];

    // this.tabela = null;
  }

  async init() {
    self = this;
    this.formcheck();

    await this.getSelect("armazem", "slc_armazem", ["armazem", "id", "id"]);

    // $("#modal-categoria-erro").modal("show");
    $("#slc_produtos").on("change", function () {
      const selectedValue = $(this).val();
      // console.log(selectedValue);
      $(this).val() !== "" && $(this).val() !== null
        ? self.esccolhaProduto(selectedValue)
        : true;

      // self.esccolhaProduto(selectedValue);
      // Faça o que desejar com o valor selecionado
      // console.log('Produto selecionado:', selectedValue);
    });
    $("#slc_armazem").on("change", function () {
      const id_armazem = $(this).val();
      self.escolhaArmazem(id_armazem);
      // Faça o que desejar com o valor selecionado
      // console.log('Produto selecionado:', selectedValue);
    });

    this.table = $("#tabela_produtos").DataTable({
      bFilter: true,
      sDom: "fBtlpi",
      ordering: true,
      language: {
        search: " ",
        sLengthMenu: "_MENU_",
        searchPlaceholder: "Search",
        info: "_START_ - _END_ of _TOTAL_ items",
        paginate: {
          next: ' <i class=" fa fa-angle-right"></i>',
          previous: '<i class="fa fa-angle-left"></i> ',
        },
      },
      initComplete: (settings, json) => {
        $(".dataTables_filter").appendTo("#tableSearch");
        $(".dataTables_filter").appendTo(".search-input");
      },
    });

    $("#tabela_produtos tbody").on("click", ".delete-item", function () {
      Swal.fire({
        icon: "warning",
        title: "Você tem certeza?",
        html: "Você não poderá reverter isso!",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim!",
        cancelButtonText: "Não!",
        confirmButtonClass: "btn btn-primary",
        cancelButtonClass: "btn btn-danger",
        // buttonsStyling: false,
        showCancelButton: true,
        preConfirm: () => {
          self.table.row($(this).parents("tr")).remove().draw();
        },
      });
    });
    // Para incrementar
    $("#tabela_produtos").on("click", ".plus-btn", function () {
      var $input = $(this).siblings(".quntity-input");
      var currentValue = parseInt($input.val()) || 0;
      $input.val(currentValue + 1);
    });

    // Para decrementar
    $("#tabela_produtos").on("click", ".minus-btn", function () {
      var $input = $(this).siblings(".quntity-input");
      var currentValue = parseInt($input.val()) || 0;
      if (currentValue > 1) {
        $input.val(currentValue - 1);
      }
    });
  }

  async escolhaArmazem(id_armazem) {
    self = this;
    try {
      await $.ajax({
        url: "assets/model/request.php",
        method: "POST",
        data: {
          request_geral: "carregar",
          tabela: "armazem",
          condicao: [["id", id_armazem]],
          coluna: ["responsavel"],
        },
        dataType: "json",

        success: function (response) {
          if (response.status == true) {
            $("#nome_responsavel_armazem").val(response.data.responsavel);
          }
        },
        erro: function (response) {
          Swal.fire({
            icon: "error",
            title: "Armazém",
            html: "Ocorreu um erro ao carregar os dados do armazém, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.",
          });
          console.log("Erro no sistema, Erro - ", response.responseText);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async esccolhaProduto(id_produto) {
    self = this;
    try {
      await $.ajax({
        url: "assets/model/stock.php",
        method: "POST",
        data: { request: "dados_produto", id_produto: id_produto },
        dataType: "json",

        success: function (response) {
          if (response.status == true) {
            // const ids = [1, 2, 3, 4, 5];
            // const valor = 3;
            // Recupera todos os atributos 'data-id' dos produtos na tabela

            const ids = [];

            $("#tabela_produtos tbody a[data-id]").each(function () {
              ids.push($(this).attr("data-id"));
            });

            console.log(ids); // Array com todos os IDs dos produtos na tabela

            if ($.inArray(response.data.produto_id, ids) !== -1) {
              console.log("Valor encontrado!");
            } else {
              console.log("Valor não encontrado!");
              self.addRecordFromObject(response.data);
            }
          }
        },
        erro: function (response) {
          Swal.fire({
            icon: "error",
            title: "Detalhes do Produto",
            html: "Ocorreu um erro ao carregar os dados do produto, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.",
          });
          console.log("Erro no sistema, Erro - ", response.responseText);
        },
      });
    } catch (error) {
      console.error(error.responseText);
    }
  }
  addRecordFromObject(obj) {
    self.addNewRecord({
      name: obj.nome_produto,
      sku: obj.codigo_stock,
      category: obj.categoria,
      produto_id: obj.produto_id,
      quantity: 1,
      image: "",
    });
  }
  addNewRecord(productData) {
    $("#slc_produtos").val("").trigger("change");

    const rowData = [
      `<div class="productimgname">
            <a href="javascript:void(0);" class="product-img stock-img">
                <img src="assets/img/icons8_product_96px.png" alt="produto">
            </a>
            <a class="produto_id" href="javascript:void(0);" data-id="${productData.produto_id}">${productData.name}</a>
        </div>`,
      `${productData.sku}`,
      `${productData.category}`,
      `<div class="product-quantity">
            <span class="quantity-btn minus-btn"><i data-feather="minus-circle" class="feather-search"></i></span>
            <input type="text" class="quntity-input" value="${productData.quantity}">
            <span class="quantity-btn plus-btn">+<i data-feather="plus-circle" class="plus-circle"></i></span>
        </div>`,
      `<div class="edit-delete-action">
                <a class="delete-item confirm-text p-2" href="javascript:void(0);">
                    <i data-feather="trash-2" class="feather-trash-2"></i>
                </a>
            </div>`,
    ];

    // Add the row to the DataTable

    const table = $("#tabela_produtos").DataTable();
    const rowNode = table.row.add(rowData).draw(false).node();

    // Garante que o último td tenha a classe (caso DataTables remova)
    $(rowNode).find("td:last").addClass("action-table-data");

    if (window.feather) {
      feather.replace();
    }
  }

  async carregarStock() {
    self = this;
    var categorias = [];
    var produtos = [];

    try {
      await $.ajax({
        url: "assets/model/stock.php",
        method: "POST",
        data: { request: "stock_lista" },
        dataType: "json",

        success: function (response) {
          if (response.status == true) {
            //   $('.select2-sasa').select2({
            //     placeholder: "Select a product...",
            //     width: '100%'
            // });
            // $('.select2').select2();
            self.dados_produto = response.data;
            Object.entries(response.data).forEach(
              ([categoria, produtosArr]) => {
                categorias.push(categoria);
                // console.log(`Categoria: ${categoria}`);
                produtosArr.forEach((produto) => {
                  produtos.push(produto);
                  // console.log(' -', produto);
                });
              }
            );

            // Para o select de categorias
            // function preencherSelectComOptgroups() {
            const $select = $("#slc_produtos");
            $select
              .empty()
              .append(
                '<option value="" selected disabled>Selecione um produto</option>'
              );

            $.each(response.data, function (categoria, produtos) {
              const $optgroup = $(`<optgroup label="${categoria}"></optgroup>`);
              // produtos[0] = nome, produtos[1] = id
              if (produtos.length === 2) {
                $optgroup.append(
                  `<option value="${produtos[1]}">${produtos[0]}</option>`
                );
              }
              $select.append($optgroup);
            });

            // $('#txt_nome_produto').text(response.data.nome_produto);
            // $('#txt_categoria').text(response.data.nome_categoria);
            // $('#txt_subcatgoria').text(response.data.nome_subcategoria);
            // $('#txt_marca').text(response.data.marca_produto);
            // $('#txt_unidade').text(response.data.produto_unidade);
            // $('#txt_codigo_stock').text(response.data.produto_codigo);
            // $('#txt_quantidade_minima').text(response.data.quantidade_minima_alerta);
            // $('#txt_quantidade').text(response.data.quantidade_estoque);
            // // $('#txt_imposto').text(response.data.filename);
            // // $('#txt_desconto').text(response.data.id);
            // $('#txt_preco').text(response.data.produto_preco);

            // $('#txt_estado').text(response.data.produto_estado);
            // $('#txt_descricao').text(response.data.produto_descricao);

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
            html: "Ocorreu um erro ao carregar os dados do produto, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.",
          });
          console.log("Erro no sistema, Erro - ", response.responseText);
        },
      });
    } catch (error) {
      console.error(error);
      // console.log("Erro no sistema, Erro - ", response.responseText);
    }
  }

  formcheck() {
    self = this;
    $("#form_adicionarstock").on("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      // Bootstrap validation
      if (this.checkValidity() === false) {
        $(this).addClass("was-validated");
        return;
      }

      // Captura dos dados
      // Method 2: Get only IDs and quantities as separate arrays
      // function getIdsAndQuantities() {
      var ids = [];
      var quantities = [];

      console.log(ids, quantities); // Exibe os IDs e quantidades no console
      // ($('#tabela_produtos tbody tr').length > 0) ? registrarStock() : true;

      if (self.table.rows().count() > 0) {
        // console.log(self.getIdsAndQuantities());
        self.adicionar_stock();

        // self.registrarStock();\
      } else {
        Swal.fire({
          icon: "error",
          title: "Regsitro de Stock?",
          html: "Nenhum registro foi adicionado, por favor <b><i>adicione</i></b> um produto ao stock.",
          // preConfirm: () => {
          //   //  self.table
          //   //     .row($(this).parents('tr'))
          //   //     .remove()
          //   //     .draw();
          // }
        });
      }

      // self.adicionar_produto();
      // Exemplo: exibir no console
      // console.log(dados);

      // Aqui você pode enviar via AJAX ou outro processamento
    });
  }
  
  adicionar_stock() {
      self = this;
      var dadosStock = new FormData();
  
      function pushData(key, value) {
          const valor = value ?? "";
          dadosStock.append(key, valor);
      }
  
      function request(dados) {
          $.ajax({
              url: "assets/model/stock.php",
              type: "post",
              data: dados,
              dataType: "JSON",
              processData: false,
              contentType: false,
              success: function (response) {
                  if (response.status == true) {
                      Swal.fire({
                          icon: "success",
                          title: "Stock Registrado",
                          html: "O stock foi guardado com sucesso!",
                          allowEscapeKey: false,
                          allowOutsideClick: false,
                          confirmButtonText: "OK",
                          preConfirm: () => {
                              location.reload();
                          }
                      });
                  }
                  if (response.status == false) {
                      console.error("Unknown error code:", response.code);
                      Swal.fire({
                          icon: "error",
                          title: "Erro ao Registrar o Stock",
                          html: "Ocorreu um erro ao registrar o stock. Por favor, tente novamente.",
                      });
                  }
              },
              error: function (response) {
                  Swal.fire({
                      icon: "error",
                      title: "Erro ao Registrar o Stock",
                      html:
                          "Por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente." +
                          "<p></p> Se o erro persistir, contacte o Administrador do Sistema para resolver o problema.",
                  });
                  console.log("Erro no sistema, Erro - ", response.responseText);
              },
          });
      }
  
      // pushData("request_geral", "adicionar_stock");
  
      // Exemplo: obtenha os IDs e quantidades dos produtos da tabela
      var ids = [];
      var quantities = [];
      // $("#tabela_produtos tbody tr").each(function () {
      //     var $row = $(this);
      //     var id = $row.find(".produto_id").data("id");
      //     var quantity = parseInt($row.find(".quntity-input").val());
      //     if (id) {
      //         ids.push(id);
      //         quantities.push(quantity);
      //     }
      // });
  
      const setIdsAndQuantities = self.getIdsAndQuantities();
      console.log(setIdsAndQuantities);

      pushData("produtos[]", setIdsAndQuantities.id);
      pushData("quantidades[]", setIdsAndQuantities.quantidade);
  
      // Adicione outros campos se necessário, como armazém, data, etc.
      pushData("armazem_id", $("#slc_armazem").val());
  
      pushData("tabela", "stock");
      pushData("request", "adicionar_stock");
  
      request(dadosStock);
  }

  // Method 2: Get only IDs and quantities as separate arrays
      getIdsAndQuantities() {
      var ids = [];
      var quantities = [];
      
      $('#tabela_produtos tbody tr').each(function() {
          var $row = $(this);
          var id = $row.find('.produto_id').data('id');
          var quantity = parseInt($row.find('.quntity-input').val());
          
          if (id) {
              ids.push(id);
              quantities.push(quantity);
          }
      });
      
      return {
          id: ids,
          quantidade: quantities
      };
    }


  showToastWarning(title, message) {
    [];
    $(".tipo-alerta").addClass("tipo-alerta");
    $("#toast-title").text(title);
    $("#toast-body").text(message);
    var toastEl = document.getElementById("jsToastWarning");
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

class detalheProduto {
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
        data: { request: "detalhe", id_produto: id_produto },
        dataType: "json",

        success: function (response) {
          if (response.status == true) {
            self.dados_produto = response.data;

            $("#txt_nome_produto").text(response.data.nome_produto);
            $("#txt_categoria").text(response.data.nome_categoria);
            $("#txt_subcatgoria").text(response.data.nome_subcategoria);
            $("#txt_marca").text(response.data.marca_produto);
            $("#txt_unidade").text(response.data.produto_unidade);
            $("#txt_codigo_stock").text(response.data.produto_codigo);
            $("#txt_quantidade_minima").text(
              response.data.quantidade_minima_alerta
            );
            $("#txt_quantidade").text(response.data.quantidade_estoque);
            // $('#txt_imposto').text(response.data.filename);
            // $('#txt_desconto').text(response.data.id);
            $("#txt_preco").text(response.data.produto_preco);

            $("#txt_estado").text(response.data.produto_estado);
            $("#txt_descricao").text(response.data.produto_descricao);

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
            html: "Ocorreu um erro ao carregar os dados do produto, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.",
          });
          console.log("Erro no sistema, Erro - ", response.responseText);
        },
      });
    } catch (error) {
      console.error(error.responseText);
      // console.log("Erro no sistema, Erro - ", response.responseText);
    }
  }
}

class gerirStock extends selectFiller {
  constructor() {
    super();
    self = this;
    this.init();
    this.carregarStock();
    // Supondo que você quer transferir o conteúdo de #div1 para #div2:
    // $('#product-search').html($('#lista-produtos').html());
    // $('#product-search').append($('#lista-produtos').children());
  }

  async init() {
    // await this.getSelect('armazem', 'slc_armazem', ['armazem', 'id', 'id']);
    // await this.detalhe();
  }

  // detalhe(){
  //   $.ajax({
  //     url: 'assets/model/stock.php',
  //     type: 'POST',
  //     dataType: 'json',
  //     data: {
  //         request: 'stock_lista' // substitua pelo id desejado
  //     },
  //     success: function(response) {
  //         if (response.status === true) {
  //             // Manipule os dados recebidos
  //             console.log(response.data);
  //         } else {
  //             // Trate erro de dados não encontrados
  //             alert('Produto não encontrado!');
  //         }
  //     },
  //     error: function(xhr, status, error) {
  //         // Trate erro de requisição
  //         console.error('Erro na requisição:', error);
  //     }
  // });
  // }
}

// $(document).ready(function () {
document.addEventListener("DOMContentLoaded", function () {
  const dataMdulo = $("#stockjs").data("modulo");
  // console.log(dataMdulo)

  if (dataMdulo == "stock-gerir") {
    const listaS = new gerirStock();
  } else if (dataMdulo == "stock-adicionar") {
    const adicionarS = new adicionarStock();
  }
});
