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
    // this.sort = ;

    // this.sort = Array.isArray(myArray) > 0 ? array : [];
    // this.ajaxurl = `assets/model/${this.url}.php`;

    this.adicionarColunasData(this.colunas);
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
      pagingType: 'first_last_numbers',
      searchDelay: this.searchDelay,
      serverSide: true,
      serverMethod: 'post',
      select: true,
      stateSave: true,
      stateLoadParams: function (settings, data) {
        data.search.search = ''; //limpa filtro geral

        data.columns.forEach((columns) => {
          columns.search = ''; // limpa o filtro de coluna
        });

      },
      order: [Array.isArray(this.sort) > 0 ? this.sort : []],

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
        url: 'assets/plugins/datatable/pt.json'
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
            }
          }
          return data;
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

}
