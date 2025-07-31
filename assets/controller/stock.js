import { selectFiller } from "./master.js";
import { Lista } from "./master.js";

class detalheStock extends Lista {
  constructor(id_stock) {
    super();
    this.id_stock = id_stock;
    this.dados_stock;

    // this.preencherselect();

    self = this;

    // this.init();
    // this.formvalidation();
    // this.carregarProduto(idProduto);
  }

  async carregarStock() {

    if ($.fn.DataTable.isDataTable('#tabela_produtos')) {
      $('#tabela_produtos').DataTable().destroy();
  }

    this.nomeTabela = "tabela_produtos";

    this.colunas = [
      'nome_produto',
      'codigo_unidade',
      'categoria',
      // 'produto_id',
      'quantidade'];

    // this.listalocal();
    this.url = "assets/model/stock.php";
    this.dataRequest = {
      request: "lista_produtos_stock",
      id_stock: this.id_stock
    };

    // if (this.colunas.length > 0) {
      this.lista();
  // } else {
  //     console.error("Column definitions are missing. Please define 'this.colunas' before initializing the DataTable.");
  // }

    self = this;

    // try {
    //   await $.ajax({
    //     url: "assets/model/stock.php",
    //     method: "POST",
    //     data: { request: "detalhe", id_stock: this.id_stock },
    //     dataType: "json",

    //     success: function (response) {
    //       if (response.status == true) {
    //         self.dados_stock = response.data;

    //         $("#txt_armazem").val(response.data.detalhe_stock.armazem);
    //         console.log(response.data.detalhe_stock.armazem);
    //         // $("#data_entrada").text(response.data.txt_data_registro);
    //         $("#txt_data_registro").val(response.data.detalhe_stock.data_entrada);
    //         $("#txt_user_registro").val(response.data.detalhe_stock.responsavel_registro);
    //         // self.addRecordFromObject(response.data.lista_stock);
    //         // console.log(response.data.lista_stock);
    //       //   response.data.lista_stock.forEach(function(item) {
    //       //     self.addRecordFromObject(item);
    //       // });
    //         // $("#txt_categoria").text(response.data.nome_categoria);
    //         // $("#txt_subcatgoria").text(response.data.nome_subcategoria);
    //         // $("#txt_marca").text(response.data.marca_produto);
    //         // $("#txt_unidade").text(response.data.produto_unidade);
    //         // $("#txt_codigo_stock").text(response.data.produto_codigo);
    //         // $("#txt_quantidade_minima").text(
    //         //   response.data.quantidade_minima_alerta
    //         // );
    //         // $("#txt_quantidade").text(response.data.quantidade_estoque);
    //         // // $('#txt_imposto').text(response.data.filename);
    //         // // $('#txt_desconto').text(response.data.id);
    //         // $("#txt_preco").text(response.data.produto_preco);

    //         // $("#txt_estado").text(response.data.produto_estado);
    //         // $("#txt_descricao").text(response.data.produto_descricao);

    //         //Secção dos fotos

    //         // ficheiro = "arquivos/produto/" + response.data.localizacao_produto + "/" + response.data.filename;

    //         // //verifica se o formato do ficheiro é compatível
    //         // if((response.data.filename.toLowerCase()).includes('.pdf')){
    //         //   $('#ficheiro_produto').attr('src', ficheiro);
    //         //   $('#ver_ficheiro').attr('href', ficheiro);
    //         // }else{
    //         //   $('.ficheiro-compativel').each(function () {
    //         //     $(this).addClass("d-none");
    //         //   });
    //         //   $('.ficheiro-incompativel').removeClass("d-none");
    //         // }
    //       }
    //     },
    //     erro: function (response) {
    //       Swal.fire({
    //         icon: "error",
    //         title: "Detalhes do Produto",
    //         html: "Ocorreu um erro ao carregar os dados do produto, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.",
    //       });
    //       console.log("Erro no sistema, Erro - ", response.responseText);
    //     },
    //   });
    // } catch (error) {
    //   console.error(error.responseText);
    //   // console.log("Erro no sistema, Erro - ", response.responseText);
    // }
  }

  addRecordFromObject(obj) {
    // $("#slc_produtos").val("").trigger("change");
    self.addNewRecord({
      name: obj.nome_produto,
      sku: obj.codigo_unidade,
      category: obj.categoria,
      produto_id: obj.produto_id,
      quantity: obj.quantidade_produto_entrada,
      image: "",
    });
  }
  addNewRecord(productData ) {
    // Clear the select2 input
    // $("#slc_produtos").val("").trigger("change");

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
  
}
class listaStock extends Lista {
  constructor() {
    //   console.log('ano')
    super();
    self = this;
    this.init();
    this.dados_stock;
    
    // if (window.feather && typeof window.feather.replace === "function") {
    //   feather.replace();
    // }

    // this.init_
  }

  init() {
    self = this;

    this.nomeTabela = "lista_stock";
    this.url = "assets/model/stock.php";

    this.colunas = [
      "armazem",
      "responsavel_registro",
      "produtos",
      "codigo_lote",
      "quantidade",
      "data_entrada",
      "action",
    ];

    this.sort = [5, "desc"];

    this.dataRequest = {
      request: "lista",
    };

    this.notOrderable = [2, 6];
    this.collumnFilter = [0, 1];
    // this.dateType = [5];

    this.lista();

    $(this.tabela)
      .find("tr")
      .each(function () {
        $(this).find("td:last").addClass("action-table-data");
      });
          // Listen for the draw event
          self.tabela.on('draw', function() {
            if (window.feather) {
              feather.replace();
            }
      // 
    });
   
    $("#lista_stock").on("click", ".visualizar-entrada", function () {
      var id = $(this).data("id");
     const detalheS = new detalheStock(id);
      document.getElementById("detalhes_stock").reset();
      detalheS.carregarStock();

      // console.log('id-', id);
      // window.open("product-details.html?id_produto=" + id, "_self");
    });
  }
  dadosStock() {
    self = this;
    // detalheProduto = new detalheProduto(self.id_produto);
    try {
      $.ajax({
        url: "assets/model/stock.php",
        method: "POST",
        data: { request: "dados_stock" },
        dataType: "json",

        success: function (response) {
          if (response.status == true) {
            self.dados_stock = response.data;
            // console.log(self.dados_stock);
          }
        },
        erro: function (response) {
          Swal.fire({
            icon: "error",
            title: "Detalhes do Stock",
            html: "Ocorreu um erro ao carregar os dados do stock, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.",
          });
          console.log("Erro no sistema, Erro - ", response.responseText);
        },
      });
    } catch (error) {
      console.error(error.responseText);
    }
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
    $("#slc_produtos").val("").trigger("change");
    self.addNewRecord({
      name: obj.nome_produto,
      sku: obj.codigo_unidade,
      category: obj.categoria,
      produto_id: obj.produto_id,
      quantity: 1,
      image: "",
    });
  }
  addNewRecord(productData) {
    // Clear the select2 input
    // $("#slc_produtos").val("").trigger("change");

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
              
              // Iterate through each product in the produtos array
              $.each(produtos, function(index, produto) {
                // produto[0] = nome, produto[1] = id
                $optgroup.append(
                  `<option value="${produto[1]}">${produto[0]}</option>`
                );
              });
              
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
              },
            });
          }
          if (response.status == false) {
            console.error("Unknown error code:", response.code);
            switch (response.code) {
              // case 1:

              // Swal.fire({
              //     icon: "error",
              //     title: "Erro ao Registrar o Stock",
              //     html: "Ocorreu um erro ao registrar o stock. Por favor, tente novamente.",
              // });
              // break;
              case 1:
                if (response.code == 1) {
                  Swal.fire({
                    icon: "error",
                    title: "Erro ao Registrar o Stock",
                    html: "A quantidade de produtos e quantidades não corresponde ou não há produtos selecionados.<br>Por favor, verifique os dados e tente novamente.",
                  });
                }
                break;
              case 2:
                if (response.code == 2) {
                  Swal.fire({
                    icon: "error",
                    title: "Erro ao Registrar",
                    html: "Ocorreu um erro ao inserir os dados no banco de dados. <p>Por favor, tente novamente ou contacte o administrador do sistema.</p>",
                  });
                }
                break;
              default:
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Registrar o Stock",
                  html: "Ocorreu um erro ao registrar o stock. Por favor, tente novamente.",
                });
            }
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
    var setIdsAndQuantities = self.getIdsAndQuantities();
    console.log(setIdsAndQuantities);

    // Iterate over the arrays using their indices
    for (let i = 0; i < setIdsAndQuantities.id.length; i++) {
      pushData("produtos[]", setIdsAndQuantities.id[i]);
      pushData("quantidades[]", setIdsAndQuantities.quantidade[i]);
    }

    // pushData("produtos[]", setIdsAndQuantities.id);
    // pushData("quantidades[]", setIdsAndQuantities.quantidade);

    // Adicione outros campos se necessário, como armazém, data, etc.
    pushData("armazem_id", $("#slc_armazem").val());

    // pushData("tabela", "stock");
    pushData("request", "adicionar_stock");

    request(dadosStock);
  }

  // Method 2: Get only IDs and quantities as separate arrays
  getIdsAndQuantities() {
    var ids = [];
    var quantities = [];

    $("#tabela_produtos tbody tr").each(function () {
      var $row = $(this);
      var id = $row.find(".produto_id").data("id");
      var quantity = parseInt($row.find(".quntity-input").val());

      if (id) {
        ids.push(id);
        quantities.push(quantity);
      }
    });

    return {
      id: ids,
      quantidade: quantities,
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

  if (dataMdulo == "stock-adicionar") {
    const adicionarS = new adicionarStock();
  } else if (dataMdulo == "stock-lista") {
    const listaS = new listaStock();
  }
});
