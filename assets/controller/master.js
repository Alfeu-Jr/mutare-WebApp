export class Lista {
  constructor() {
    self = this;
    this.response = '';
    this.nomeTabela = '';
    this.tabela = '';
    this.url = '';
    this.colunas = [];
    this.addcolunas = [];

    this.tabelax = true;
    this.responsive = true;
    this.tabelasave = true;
    this.lengthMenu = [10, 25, 50, 75, 100];
    this.pageLength = [50]; //quantidade de registros padrão
    this.dom = 'Bflrtip'; //tipo de botoes
    this.search = true;
    this.serverSide = true;
    this.search = true;
    this.searchDelay = 500;


    this.dataRequest = {};
    this.notOrderable = [];
    this.dateType = [];
    this.collumnFilter = [];
    this.filtroColuna = [];
    this.keysToRetrieve = [];
    this.filtroArray = [];
    this.sort = []; // Default to an empty array

    // this.sort = ;

    // this.sort = Array.isArray(myArray) > 0 ? array : [];
    // this.ajaxurl = `assets/model/${this.url}.php`;

    try{
      this.adicionarColunasData(this.colunas);

    }catch(e){
      console.error("Erro ao inicializar a classe Lista:", e);
    }
    // console.log(self.adicionarColunasData(self.colunas))
    // this.addbuttons = []
    // this.buttons = ["excel", "pdf",]
  }
  lista() {

    // console.log(this.colunas.map(col => ({ 'data': col })));
    this.tabela = $(`#${this.nomeTabela}`).DataTable({
      lengthMenu: this.lengthMenu,
      orderCellsTop: true, // permitir somente o header de fazer o sorting
      fixedHeader: true,
      // pagingType: 'first_last_numbers',
      searchDelay: this.searchDelay,
      serverSide: true,
      serverMethod: 'post',
      select: true,
      stateSave: true,
     
      stateLoadParams: function (settings, data) {
        data.search.search = ''; // limpa filtro geral

        data.columns.forEach((column) => {
            // Garante que search é um objeto com a propriedade search como string
            column.search = { search: '' };
        });
      },
      // order: [Array.isArray(this.sort) > 0 ? this.sort : []],
      order: this.sort.length > 0 ? this.sort : [],


      dom: 'Bflrtip',
      "buttons": ["excel", "pdf",
        {
          extend: 'print',
          text: 'Imprimir',
        },
        {
          extend: 'colvis',
          text: 'Mostrar/Ocultar',
        }],
      language: {
        url: 'assets/plugins/datatable/pt.json',
      },
       paginate: {
              next: ' <i class=" fa fa-angle-right"></i>',
              previous: '<i class="fa fa-angle-left"></i> '
            },
      ajax: {
        url: self.url,
        data: this.adicionarDadosRequest(this.dataRequest)
      },
      drawCallback: function (settings) {
        self.response = settings.json.totalResponse;
        // console.log(response)
        if (self.collumnFilter.length > 0) {
          const valoresUnicos = self.retornarValoresUnicos(self.response);
          // console.log(valoresUnicos);
          //retorna somente os objectos que conscidem com os valores das colunas
          const valoresColunas = self.colunas.map(key => {
            return { [key]: valoresUnicos[key] };
          });

          // transforma objectos em array
          // self.filtroArray = Object.values(valoresColunas);

          self.filtroArray = valoresColunas.map(entry => Object.values(entry)[0] || []);

        }
      },
      columns: this.colunas.map(col => ({ 'data': col })),

      columnDefs: [{ orderable: false, targets: this.notOrderable },
      {
        targets: this.dateType,
        render: function (data, type, row) {
          if (type === 'display') {
            if (isNaN(data) && moment(data, 'YYYY-MM-DD HH:mm', true).isValid()) {
              return moment(data).format('DD/MM/YYYY HH:mm');
            } else if(moment(data, 'YYYY-MM-DD', true).isValid()){
              return moment(data).format('DD/MM/YYYY');
            }
          }
          return data;
        }
      }
      ,
      {
        targets: this.colunas.length - 1, // Última coluna
        createdCell: function(td, cellData, rowData, row, col) {
          $(td).addClass('action-table-data');
        }
      }
      ],
      

      // layout: {
      //   bottomStart: {
      //     buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
      //   },
      //   topStart: 'pageLength'

      // },
      initComplete: function () {
        let index = 0;

        const filtros = self.optimizarResponse(self.response, self.colunas)
        //colunas visíveis
        let result = self.tabela.columns().visible().reduce((a, v, i) => v ? [...a, i] : a, [])

        this.api().columns(result).every(function () {

          if ($.inArray(result[index], self.collumnFilter) !== -1) {
            const colunas = (self.filtroArray[result[index]]);
            colunas.forEach((coluna) => {
            });
          }

          var column = this;
          // console.log(column.index() + ' == ' + self.collumnFilter);
          if ($.inArray(column.index(), self.collumnFilter) !== -1) {
            var select = $('<select><option value="">Filtro</option></select>')
              .appendTo($(`#${self.nomeTabela} thead tr:eq(1) th`).eq(index).empty())
              .on('change', function () {
                column.search($(this).val(), { exact: true })
                  .draw();
              });

            self.filtroArray[column.index()].forEach((coluna) => {
              select.append(
                '<option value="' + coluna + '">' + coluna + '</option>'
              );
            });

            // column.data().unique().sort().each(function (d, j) {
            //   select.append(
            //     '<option value="' + d + '">' + d + '</option>'
            //   );
            // });
          }
          index++;
        });
      }
    });

    this.tabela.columns(self.collumnFilter).every(function () {
      var that = this;

      // Create the select list and search operation
      var select = $('<select />')
        .appendTo(this.footer())
        .on('change', function () {
          that.search($(this).val()).draw();
        });

      // Get the search data for the first column and add to the select list
      this.cache('search')
        .sort()
        .unique()
        .each(function (d) {
          select.append($('<option value="' + d + '">' + d + '</option>'));
        });
    });
  }

  listalocal() {
    this.tabela = $(`#${this.nomeTabela}`).DataTable({
        lengthMenu: this.lengthMenu,
        orderCellsTop: true,
        fixedHeader: true,
        pagingType: 'first_last_numbers',
        searchDelay: this.searchDelay,
        select: true,
        stateSave: true,
        // stateLoadParams: (settings, data) => {
        //     data.search.search = '';
        //     data.columns.forEach((columns) => {
        //         columns.search = '';
        //     });
        // },
        // order: [Array.isArray(this.sort) && this.sort.length > 0 ? this.sort : []],
        dom: 'Bflrtip',
        buttons: ["excel", "pdf", {
            extend: 'print',
            text: 'Imprimir',
        }, {
            extend: 'colvis',
            text: 'Mostrar/Ocultar',
        }],
        language: {
            url: 'assets/plugins/datatable/pt.json'
        },
        // drawCallback: (settings) => {
        //     this.response = settings.json.totalResponse;
        //     if (this.collumnFilter.length > 0) {
        //         const valoresUnicos = this.retornarValoresUnicos(this.response);
        //         const valoresColunas = this.colunas.map(key => {
        //             return { [key]: valoresUnicos[key] };
        //         });
        //         this.filtroArray = valoresColunas.map(entry => Object.values(entry)[0] || []);
        //     }
        // },
        // columns: Array.isArray(this.colunas) && this.colunas.length > 0 ? this.colunas.map(col => ({ 'data': col })) : [],
        // columnDefs: [{
        //     orderable: false,
        //     targets: this.notOrderable
        // }, {
        //     targets: this.dateType,
        //     render: (data, type) => {
        //         if (type === 'display') {
        //             if (isNaN(data) && moment(data, 'YYYY-MM-DD HH:mm', true).isValid()) {
        //                 return moment(data).format('DD/MM/YYYY HH:mm');
        //             }
        //         }
        //         return data;
        //     }
        // }],
        // initComplete: () => {
        //     let index = 0;
        //     const filtros = this.optimizarResponse(this.response, this.colunas);
        //     let result = this.tabela.columns().visible().reduce((a, v, i) => v ? [...a, i] : a, []);
        //     this.api().columns(result).every(function () {
        //         if ($.inArray(result[index], this.collumnFilter) !== -1) {
        //             const colunas = (this.filtroArray[result[index]]);
        //             colunas.forEach((coluna) => {
        //                 // Additional logic can be added here if needed
        //             });
        //         }
        //         var column = this;
        //         if ($.inArray(column.index(), this.collumnFilter) !== -1) {
        //             var select = $('<select><option value="">Filtro</option></select>')
        //                 .appendTo($(`#${this.nomeTabela} thead tr:eq(1) th`).eq(index).empty())
        //                 .on('change', function () {
        //                     column.search($(this).val(), { exact: true }).draw();
        //                 });
        //             this.filtroArray[column.index()].forEach((coluna) => {
        //                 select.append('<option value="' + coluna + '">' + coluna + '</option>');
        //             });
        //         }
        //         index++;
        //     });
        // }
    });

    this.tabela.columns(this.collumnFilter).every(function () {
        var that = this;
        var select = $('<select />')
            .appendTo(this.footer())
            .on('change', function () {
                that.search($(this).val()).draw();
            });
        this.cache('search').sort().unique().each(function (d) {
            select.append($('<option value="' + d + '">' + d + '</option>'));
        });
    });
}

  adicionarColunasData(array) {
    let addcolunas = [];
    array.forEach(name => {
      addcolunas.push({ 'data': name });
    });
    return addcolunas;
  }

  adicionarDadosRequest(array) {
    const dataObject = {};
    Object.keys(array).forEach(key => {
      dataObject[key] = array[key];
    });
    return dataObject;
  }

  colunasFiltro(array, positions) {
    const results = [];
    for (let pos of positions) {
      if (pos >= 0 && pos < array.length) {
        results.push(array[pos]);
      } else {
        console.warn(`Position ${pos} is out of bounds for the array.`);
      }
    }
    return results;
  }

  optimizarResponse(response, colunas) {
    const uniqueValues = {};

    response.forEach(report => {
      Object.keys(report).forEach(key => {
        if (!uniqueValues[key]) {
          uniqueValues[key] = new Set();
        }
        uniqueValues[key].add(report[key]);
      });
    });

    // Convert Sets to Arrays for easier use
    for (const key in uniqueValues) {
      uniqueValues[key] = Array.from(uniqueValues[key]);
    }



    const refactoredObject = colunas.reduce((acc, key) => {
      if (uniqueValues[key]) {
        acc[key] = uniqueValues[key];
      }
      return acc;
    }, {});



    return refactoredObject;
  }

  retornarValoresUnicos(reports) {
    const uniqueValues = {};

    reports.forEach(report => {
      Object.keys(report).forEach(key => {
        if (!uniqueValues[key]) {
          uniqueValues[key] = new Set();
        }
        uniqueValues[key].add(report[key]);
      });
    });

    // Convert Sets to Arrays for easier use
    for (const key in uniqueValues) {
      uniqueValues[key] = Array.from(uniqueValues[key]);
    }

    return uniqueValues;
  }

  fillSelectFromArray(elemento, conteudo) {
    // Limpa opções existentes
    while (elemento.options.length > 0) {
        elemento.remove(0);
    }
    // Adiciona opção padrão
    const defaultOption = document.createElement('option');
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.value = "";
    defaultOption.textContent = "Selecione";
    elemento.appendChild(defaultOption);

    // Adiciona novas opções
    conteudo.forEach(item => {
        if (Array.isArray(item) && item.length >= 2) {
            const optionElement = document.createElement('option');
            optionElement.value = item[0];
            optionElement.textContent = item[1];
            elemento.appendChild(optionElement);
        }
    });
}

}
// file2.js
export class selectFiller {


  // parametros (id_do_select, conteudo, ['v1','v2'], [datan])
  // v1 - nome chave do conteudo, o valor sera atribuido ao texto do select ;
  // v2 - nome da chave do conteudo, o valor sera atribuido ao atibutto value do select;
  // datan (opcional) - nome da chave do conteudo, o valor sera definido ao atributo extra a ser criado a cada <option>, nomeclatura do atributo: 'data-datan'
  fillSelect(elemento, conteudo, variaveis, attributos) {
    const select_conteudo = variaveis[0];
    const select_value = variaveis[1];
    const atributos = variaveis.slice(2);

        while (elemento.options.length > 0) {
          elemento.remove(0);
      }
      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.selected = true;
      defaultOption.disabled = true;
      defaultOption.value = "";
      defaultOption.textContent = "Selecione";
      elemento.appendChild(defaultOption);
      
    // Adiciona as novas opções
    conteudo.forEach(conteudo => {
      const optionElement = document.createElement('option');
      optionElement.textContent = conteudo[select_conteudo];
      optionElement.value = conteudo[select_value];

      atributos.forEach(atributo => {
        optionElement.setAttribute("data-" + atributo, conteudo[atributo]);
      });

      // console.log(elemento)
      elemento.appendChild(optionElement);
    });
  }

  getSelect(table, elementId, keys) {
    let self = this;
    return new Promise((resolve, reject) => {
      var element = document.getElementById(elementId);
      $.ajax({
        url: 'assets/model/request.php',
        type: 'post',
        data: { request_geral: 'listar_slc', tabela: table },
        dataType: 'json',
        success: function (response) {

          self.fillSelect(element, response, keys);
          resolve();
        },
        error: function (error) {
          reject(error);
        }
      })
    })
  }


}

export class toasterAlerta {

  showToastWarning(title, message) {
    $('#toast-warning-title').text(title);
    $('#toast-warning-body').text(message);
    var toastEl = document.getElementById('jsToastWarning');
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

export class selectFillerr {
  constructor() {
    self = this;
    this.response = '';
    this.nomeTabela = '';
    this.tabela = '';
    this.url = '';
    // this.colunas = [];
    // this.addcolunas = [];

    // this.tabelax = true;
    // this.tabelasave = true;
    // this.lengthMenu = [10, 25, 50, 75, 100];
    // this.pageLength = [50]; //quantidade de registros padrão
    // this.dom = 'Bflrtip'; //tipo de botoes
    // this.search = true;
    // this.serverSide = true;
    // this.searchDelay = 500;

    // this.dataRequest = {};
    // this.notOrderable = [];
    // this.dateType = [];
    // this.collumnFilter = [];
    // this.filtroColuna = [];
    // this.keysToRetrieve = [];
    // this.filtroArray = [];
  }
  // Original method - works with flat data
  fillSelect(elemento, conteudo, variaveis, attributos) {
    const select_conteudo = variaveis[0];
    const select_value = variaveis[1];
    const atributos = variaveis.slice(2);
    
    while (elemento.options.length > 0) {
      elemento.remove(0);
    }
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.value = "";
    defaultOption.textContent = "Selecione";
    elemento.appendChild(defaultOption);
    
    // Add options
    conteudo.forEach(conteudo => {
      const optionElement = document.createElement('option');
      optionElement.textContent = conteudo[select_conteudo];
      optionElement.value = conteudo[select_value];
      
      atributos.forEach(atributo => {
        optionElement.setAttribute("data-" + atributo, conteudo[atributo]);
      });
      
      elemento.appendChild(optionElement);
    });
  }

  // New method - handles grouped data with categories
  fillSelectGrouped(elemento, conteudo, variaveis, attributos, groupByKey = 'category') {
    const select_conteudo = variaveis[0];
    const select_value = variaveis[1];
    const atributos = variaveis.slice(2);
    
    while (elemento.options.length > 0) {
      elemento.remove(0);
    }
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.value = "";
    defaultOption.textContent = "Selecione";
    elemento.appendChild(defaultOption);
    
    // Group data by category
    const groupedData = this.groupByCategory(conteudo, groupByKey);
    
    // Create optgroups for each category
    Object.keys(groupedData).forEach(categoryName => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = categoryName;
      
      groupedData[categoryName].forEach(item => {
        const optionElement = document.createElement('option');
        optionElement.textContent = item[select_conteudo];
        optionElement.value = item[select_value];
        
        atributos.forEach(atributo => {
          optionElement.setAttribute("data-" + atributo, item[atributo]);
        });
        
        optgroup.appendChild(optionElement);
      });
      
      elemento.appendChild(optgroup);
    });
  }

  // Helper method to group data by category
  groupByCategory(data, groupByKey) {
    return data.reduce((groups, item) => {
      const category = item[groupByKey] || 'Outros';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  }

  // Enhanced method - automatically detects if data should be grouped
  fillSelectSmart(elemento, conteudo, variaveis, attributos, options = {}) {
    const {
      groupByKey = 'category',
      enableGrouping = true,
      sortCategories = true,
      sortItems = true
    } = options;

    // Check if grouping should be applied
    const shouldGroup = enableGrouping && conteudo.some(item => item[groupByKey]);
    
    if (shouldGroup) {
      // Sort data if requested
      if (sortItems) {
        conteudo.sort((a, b) => {
          const categoryCompare = (a[groupByKey] || '').localeCompare(b[groupByKey] || '');
          if (categoryCompare !== 0) return categoryCompare;
          return (a[variaveis[0]] || '').localeCompare(b[variaveis[0]] || '');
        });
      }
      
      this.fillSelectGrouped(elemento, conteudo, variaveis, attributos, groupByKey);
    } else {
      this.fillSelect(elemento, conteudo, variaveis, attributos);
    }
  }

  // Original method with enhanced error handling
  getSelect(table, elementId, keys, options = {}) {
    let self = this;
    return new Promise((resolve, reject) => {
      var element = document.getElementById(elementId);
      
      if (!element) {
        reject(new Error(`Element with ID '${elementId}' not found`));
        return;
      }

      $.ajax({
        url: `assets/model/${self.url}.php`,
        type: 'post',
        data: { request: self.request, tabela: table },
        dataType: 'json',
        success: function (response) {
          try {
            if (options.useSmartFill) {
              self.fillSelectSmart(element, response, keys, [], options);
            } else if (options.groupByKey) {
              self.fillSelectGrouped(element, response, keys, [], options.groupByKey);
            } else {
              self.fillSelect(element, response, keys, []);
            }
            resolve(response);
          } catch (error) {
            reject(error);
          }
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  }

  // New method specifically for products grouped by categories
  getProductsByCategory(elementId, keys, options = {}) {
    const defaultOptions = {
      groupByKey: 'category_name',
      useSmartFill: true,
      sortCategories: true,
      sortItems: true,
      // ...options
    };

    return this.getSelect('products', elementId, keys, defaultOptions);
  }
}

export class geral{
  constructor() {
  this.selectFiller = new selectFiller();
}
}

// Usage examples:

/*
// Basic usage (original functionality)
const filler = new selectFiller();
filler.getSelect('products', 'product-select', ['name', 'id']);

// Grouped usage - products by category
filler.getProductsByCategory('product-select', ['name', 'id']);

// Custom grouped usage
filler.getSelect('products', 'product-select', ['name', 'id'], {
  groupByKey: 'category_name',
  useSmartFill: true,
  sortCategories: true,
  sortItems: true
});

// Manual grouped fill (if you already have the data)
const productData = [
  { id: 1, name: 'Laptop Dell', category_name: 'Eletrônicos', price: 2500 },
  { id: 2, name: 'Mouse Logitech', category_name: 'Eletrônicos', price: 50 },
  { id: 3, name: 'Cadeira Gamer', category_name: 'Móveis', price: 800 },
  { id: 4, name: 'Mesa de Escritório', category_name: 'Móveis', price: 400 }
];

const element = document.getElementById('product-select');
filler.fillSelectGrouped(element, productData, ['name', 'id'], ['price'], 'category_name');
*/