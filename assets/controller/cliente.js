import { selectFiller } from "./master.js";
import { Lista } from "./master.js";

// class listaCliente extends Lista {
//   constructor() {
//     super();
//     self = this;
//     this.init();
//     this.dados_cliente;
//     this.formcheck();
//   }

//   init() {
//     self = this;

//     this.nomeTabela = "lista_cliente";
//     this.url = "assets/model/cliente.php";

//     this.colunas = [
//       "codigo",      // Código do cliente
//       "nome",        // Nome do cliente
//       "email",       // Email
//       "telefone",    // Telefone
//       "provincia",   // Província
//       "endereco",    // Endereço
//       "data_registro", // Data de registro
//       "action"
//     ];

//     this.sort = [0, "desc"];

//     this.dataRequest = {
//       request: "lista",
//     };

//     this.notOrderable = [7];
//     this.collumnFilter = [0, 1];

//     // this.lista();

//     // $(this.tabela)
//     //   .find("tr")
//     //   .each(function () {
//     //     $(this).find("td:last").addClass("action-table-data");
//     //   });

//     // self.tabela.on('draw', function() {
//     //   if (window.feather) {
//     //     feather.replace();
//     //   }
//     // });
//   }

  
//   formcheck() {
//     self = this;
//     $("#form_adicionarcliente").on("submit", function (event) {
//       event.preventDefault();
//       event.stopPropagation();

//       if (this.checkValidity() === false) {
//         $(this).addClass("was-validated");
//         return;
//       }

//       // Adicione aqui a lógica para adicionar cliente
//     //   self.adicionar_cliente();
//     });
//   }

//   adicionar_cliente() {
//     self = this;
//     var dadosCliente = new FormData();

//     function pushData(key, value) {
//       const valor = value ?? "";
//       dadosCliente.append(key, valor);
//     }

//     // Campos do cliente
//     pushData("codigo", $("#txt_codigocliente").val());
//     pushData("nome", $("#txt_nomecliente").val());
//     pushData("email", $("#txt_emailcliente").val());
//     pushData("telefone", $("#txt_telefonecliente").val());
//     pushData("provincia", $("#txt_provinciacliente").val());
//     pushData("endereco", $("#txt_enderecocliente").val());
//     pushData("data_registro", $("#txt_dataregistrocliente").val());
//     pushData("observacoes", $("#txt_observacoescliente").val());
//     pushData("request", "adicionar_cliente");

//     $.ajax({
//       url: "assets/model/cliente.php",
//       type: "post",
//       data: dadosCliente,
//       dataType: "JSON",
//       processData: false,
//       contentType: false,
//       success: function (response) {
//         if (response.status == true) {
//           Swal.fire({
//             icon: "success",
//             title: "Cliente Registrado",
//             html: "O cliente foi guardado com sucesso!",
//             allowEscapeKey: false,
//             allowOutsideClick: false,
//             confirmButtonText: "OK",
//             preConfirm: () => {
//               location.reload();
//             }
//           });
//         } else {
//           Swal.fire({
//             icon: "error",
//             title: "Erro ao Registrar o Cliente",
//             html: "Ocorreu um erro ao registrar o cliente. Por favor, tente novamente.",
//           });
//         }
//       },
//       error: function (response) {
//         Swal.fire({
//           icon: "error",
//           title: "Erro ao Registrar o Cliente",
//           html: "Por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.<p></p> Se o erro persistir, contacte o Administrador do Sistema para resolver o problema.",
//         });
//         console.log("Erro no sistema, Erro - ", response.responseText);
//       },
//     });
//   }
// }

class listaCliente extends Lista {
  constructor() {
    super();
    self = this;
    this.init();
    this.formcheck();
    // this.carregarClientes();
   }

  async init() {
      self = this;
  
      this.nomeTabela = "lista_cliente";
      this.url = "assets/model/cliente.php";
  
      this.colunas = [
        "codigo",      // Código do cliente
        "cliente",        // Nome do cliente
        "email",       // Email
        "telefone",    // Telefone
        "provincia",   // Província
        "endereco",    // Endereço
        "data_registro", // Data de registro
        "action"
      ];
  
      this.sort = [0, "desc"];
  
      this.dataRequest = {
        request: "lista",
      };
  
      this.notOrderable = [7];
      this.collumnFilter = [0, 1];
      this.dateType = [6];
  
      this.lista();
      
      
    $(this.tabela)
    .find("tr")
    .each(function () {
      $(this).find("td:last").addClass("action-table-data");
    });

    // self.tabelar = this.tabela;

        // Listen for the draw event
        self.tabela.on('draw', function() {
          if (window.feather) {
            feather.replace();
          }
    // 
    // if (window.feather && typeof window.feather.replace === 'function') {
    //     feather.replace();
    // } else {
    //     console.error("Feather icons library is not loaded or replace method is not available.");
    // }
  });
  
      // $(this.tabela)
      //   .find("tr")
      //   .each(function () {
      //     $(this).find("td:last").addClass("action-table-data");
      //   });
  
      // self.tabela.on('draw', function() {
      //   if (window.feather) {
      //     feather.replace();
      //   }
      // });
    // }
    
    // Adicione listeners e inicializações específicas aqui, se necessário
  }

  // async carregarClientes() {
  //   self = this;
  //   try {
  //     await $.ajax({
  //       url: "assets/model/cliente.php",
  //       method: "POST",
  //       data: { request: "cliente_lista" },
  //       dataType: "json",
  //       success: function (response) {
  //         if (response.status == true) {
  //           self.dados_cliente = response.data;
  //           // Preencha selects ou listas conforme necessário
  //         }
  //       },
  //       erro: function (response) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Detalhes do Cliente",
  //           html: "Ocorreu um erro ao carregar os dados do cliente, por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.",
  //         });
  //         console.log("Erro no sistema, Erro - ", response.responseText);
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  formcheck() {
    self = this;
    $("#form_adicionarcliente").on("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (this.checkValidity() === false) {
        $(this).addClass("was-validated");
        return;
      }

      // Adicione aqui a lógica para adicionar cliente
      self.adicionar_cliente();
    });
  }

  adicionar_cliente() {
    self = this;
    var dadosCliente = new FormData();

    function pushData(key, value) {
      const valor = value ?? "";
      dadosCliente.append(key, valor);
    }

        // pushData("request", "adicionar_cliente");
        // pushData("nome", $("#txt_nomecliente").val()); // Nome do Cliente/Instituição
        // pushData("email", $("#txt_email").val()); // Email
        // pushData("telefone", $("#phone").val()); // Telefone
        // pushData("responsavel", $("#txt_responsavel").val()); // Responsável pelo Local
        // pushData("contacto_responsavel", $("#txt_contacto_responsavel").val()); // Contacto do Responsável
        // pushData("provincia", $("#slc_provincia").val()); // Província (ajuste o id conforme seu select)
        // pushData("endereco", $("#txt_endereco").val()); // Endereço
        // pushData("descricao", $("#txt_descricao").val()); // Descrições/Observações
        // pushData("request", "adicionar_cliente");
    
        pushData("request_geral", "adicionar");

        // const now = new Date();
        const now = new Date();
        const microseconds = now.getTime() * 150 + Math.floor(now.getMilliseconds() * 110);
         const codigoCliente = ("CL-",(String(microseconds).slice(-12).padStart(12, '1')));

        const campos = [
          'codigo',
          "cliente",
          "email",
          "telefone",
          "responsavel",
          "contacto_responsavel",
          "provincia",
          "endereco",
          "descricao",
        ];
        const valores = [
          codigoCliente, // Código do Cliente
          $("#txt_nomecliente").val(),
          $("#txt_email").val(),
          $("#phone").val(),
          $("#txt_responsavel").val(),
          $("#txt_contacto_responsavel").val(),
          $("#slc_provincia").val(),
          $("#txt_endereco").val(),
          $("#txt_descricao").val(),
        ];
    
        Array.from(campos).forEach(function (file) {
          pushData("coluna[]", file);
        });
    
        Array.from(valores).forEach(function (file) {
          pushData("valores[]", file);
        });
    
        const condicao = [
          ["cliente", ($("#txt_nomecliente").val())]
        ];
    
        condicao.forEach(function (condition, index) {
          dadosCliente.append(`condicao[${index}][]`, condition[0]); // key
          dadosCliente.append(`condicao[${index}][]`, condition[1]); // value
        });
    
        pushData("tabela", "cliente");
    
        // request(dadoscliente);

        // console.log("Lista de Clientes Inicializada");

    $.ajax({
      url: "assets/model/request.php",
      type: "post",
      data: dadosCliente,
      dataType: "JSON",
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status == true) {
          Swal.fire({
            icon: "success",
            title: "Cliente Registrado",
            html: "O cliente foi guardado com sucesso!",
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: "OK",
            preConfirm: () => {
              $('#lista_armazem').modal('hide');
              $('#add-units').modal('hide');
              self.tabela.ajax.reload();
              // location.reload();
            }
          });
          $("#modal-adicionar-categoria").modal("hide");
        } if (response.status == false) {
          console.error("Unknown error code:", response.code);

          Swal.fire({
            icon: "error",
            title: "Erro ao Registrar o Cliente",
            html: "Ocorreu um erro ao registrar o cliente. Por favor, tente novamente.",
          });
        }
      },
      error: function (response) {
        Swal.fire({
          icon: "error",
          title: "Erro ao Registrar o Cliente",
          html: "Por favor <b><i>retorne</i></b> ao Menu Principal e tente novamente.<p></p> Se o erro persistir, contacte o Administrador do Sistema para resolver o problema.",
        });
        console.log("Erro no sistema, Erro - ", response.responseText);
      },
    });
  }
}

// Inicialização automática
document.addEventListener("DOMContentLoaded", function () {
  const dataMdulo = $("#clientejs").data("modulo");

  if (dataMdulo == "cliente-adicionar") {
    const adicionarC = new adicionarCliente();
  } else if (dataMdulo == "cliente-lista") {
    const listaC = new listaCliente();
  }
});