/*
* Lex - Lexical Analysis
*
* Marcos V. de M. Lima - Computer Science - URI 2017
*
* MIT LICENSE
*/

/*
*
*
*/

globalTable = [];
// remove
dictionary = ['teste'];

for (i = 0; i < dictionary.length; i++) {
  $('#dictionary-list').append($('<li class="collection-item" id="word' + i + '">' + dictionary[i] + '<a href="javascript:removeWord(' + i + '); class="icon-remove secondary-content" title="Remover"><i class="material-icons">cancel</i></a></li>'));
}

/* remover - monta tabela conforme dicionario */

/* cria a máquina de estados */
// (6) [Array(0), Array(0), Array(0), Array(0), Array(0), Array(0)]
// 0
// :
// [t: 1]
// 1
// :
// [e: 2]
// 2
// :
// [s: 3]
// 3
// :
// [t: 4]
// 4
// :
// [e: 5]
// 5
// :
// [terminal: true]

var states = [[]];
var next = 0;
var overview = 0;

//var tokens_size = dictionary.length;
for (i = 0; i < dictionary.length; i++) {
  var symbol = dictionary[i];
  var current = 0;

  for (j = 0; j < symbol.length; j++) {
    //var teste = states[initial_state][iterator_tokens];
    var type = typeof states[current][symbol[j]];
    // console.log(type);
    if (type === typeof undefined){
      //console.log('Is a undefined')
      next = overview + 1;
      //console.log(next);
      states[current][symbol[j]] = next;
      //console.log(states);
      states[next] = [];
      //console.log(states[next]);
      current = next;
      overview = current;
    } else {
      console.log('defined');
      current = states[current][symbol[j]];
    }
    if (j == symbol.length -1) {
      states[current]['terminal'] = true;
    }
  }
  console.log(states); //-> states debug
}


/* Mapea com a chave [estados][symbol] */
var array_tmp = [];
for (i = 0; i < states.length; i++) {
    var swap = [];
    swap['states'] = i;

    var first = 'a';
    var last = 'z';
    for (j = first.charCodeAt(0); j <= last.charCodeAt(0); j++ ) {
      var symbol = String.fromCharCode(j);
      if (typeof states[i][symbol] === 'undefined') {
        swap[symbol] = '-';
      } else {
        swap[symbol] = states[i][symbol];
      }
    }
    if (typeof states[i]['terminal'] !== 'undefined') {
      swap['terminal'] = true;
    }
    array_tmp.push(swap);
}
console.log(array_tmp);

globalTable = array_tmp;

/*   Tabela   */
var html_table = $('table');
html_table.html('');

var html_tr = $(document.createElement('tr'));
var html_th = $(document.createElement('th'));

html_th.html('Estado');
html_tr.append(html_th);

// console.log(first);
// console.log(last);

for (i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
  var html_th = $(document.createElement('th'));
  html_th.html(String.fromCharCode(i));
  html_tr.append(html_th);
}
html_table.append(html_tr);

for (i = 0; i < array_tmp.length; i++) {
  var html_tr = $(document.createElement('tr'));
  var html_td = $(document.createElement('td'));

  if (array_tmp[i]['terminal']) {
    html_td.html('q' + array_tmp[i]['states'] + '*');
  } else {
    html_td.html('q' + array_tmp[i]['states']);
  }
  html_tr.append(html_td);
  html_tr.addClass('states_'+array_tmp[i]['states']);

  for (j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
    var symbol = String.fromCharCode(j);

    var html_td = $(document.createElement('td'));
    html_td.addClass('word-'+symbol);

    if (array_tmp[i][symbol] != '-') {
      html_td.html('q' + array_tmp[i][symbol]);
    }
    html_tr.append(html_td);
  }
  html_table.append(html_tr);
}

$( '#search-token' ).keyup(function(event) {
  console.log('aqui');
  if (globalTable.length > 0) {
    var symbol = $('#search-token').val();
    var state = 0;
    if (symbol.length == 0) {
      $('#search-token').removeClass('ac');
  		$('#search-token').removeClass('wa');
  		$('#table tr').removeClass('state-match');
  		$('#table td').removeClass('symbol-match');
    }

    for (var i = 0; i < symbol.length; i++) {
  //verifica se sao caracteres do alfabeto ('a' a 'z')
      if(symbol[i] >= 'a' && symbol[i] <= 'z'){
        $('#table tr').removeClass('state-match');
        $('#table td').removeClass('symbol-match');
        $('#table .states_' + state).addClass('state-match');
        $('#table .word-' + symbol[i]).addClass('symbol-match');
        if(globalTable[state][symbol[i]] != '-'){
          state = globalTable[state][symbol[i]];
          $('#validate').addClass('correct');
          $('#validate').removeClass('error');
        } else {
          $('#validate').removeClass('correct');
          $('#validate').addClass('error');
          break;
        }
      } else if(symbol[i] == ' '){ //verifica se o caracter digitado é espaço
        $('#table tr').removeClass('state-match');
        $('#table td').removeClass('symbol-match');
        $('#table .states_' + state).addClass('state-match');
        $('#table .word-' + symbol[i]).addClass('symbol-match');
        if(globalTable[state]['terminal']){
          state = 0;
        } else {
          $('#validate').removeClass('correct');
          $('#validate').addClass('error');
          break;
        }
      } else { //se nao for caracter do alfabeto nem espaço, é adicionado classe de erro
        $('#validate').removeClass('correct');
        $('#validate').addClass('error');
        alert('Caractere fora do range: ' + symbol[i]);
        break;
      }
    };
  }
})
