/*
*
* Lex - Lexical Analysis
*
*/

// main
globalTable = [];

$( "#form-token" ).submit(function( event ) {
  console.log( "Token .submit() is called." );
  document.getElementById("btn-input-token").style.visibility = "hidden";



  var words = $('#input-token').val();

  words = words.toLowerCase();
  words = words.split(' ');

  var tokens = [];
  for (i = 0; i < words.length; i++) {
    if (tokens.indexOf(words[i]) < 0 && words[i].length > 0) {
      tokens.push(words[i]);
    }
  }

  var html_dicionario_div = $( "<h6 class='center'>Dicionário</h6>")
  $('.registered-tokens').prepend(html_dicionario_div);
  var tokens_size = tokens.length;

  for (i = 0; i < tokens_size; i++) {
    console.log(tokens[i]);
    $('#list-tokens').prepend(tokens[i] + '<br>');
  }

  var states = [[]];
  var next = 0;
  var overview = 0;
  for (i = 0; i < tokens_size; i++) {
    var iterator_tokens = tokens[i];
    var current = 0;

    for (j = 0; j < iterator_tokens.length; j++) {
      //var teste = states[initial_state][iterator_tokens];
      var type = typeof states[current][iterator_tokens[j]];
      // console.log(type);
      if (type === typeof undefined){
        //console.log('Is a undefined')
        next = overview + 1;
        //console.log(next);
        states[current][iterator_tokens[j]] = next;
        //console.log(states);
        states[next] = [];
        //console.log(states[next]);
        current = next;
        overview = current;
      } else {
        console.log('defined');
        current = states[current][iterator_tokens[j]];
      }
      if (j == iterator_tokens.length -1) {
        states[current]['terminal'] = true;
      }
    }
    console.log(states); //-> states debug
  }

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

  event.preventDefault();
  return false;
});

// show tokens function
$( '#search-token' ).keyup(function(event) {
  // put condicional here if length table > 0 call function to validate words.
  if (globalTable.length > 0) {

    var symbol = $('#search-token').val();
    console.log(symbol);
    var symbol_length = symbol.length;
    //console.log(symbol_length);

    if (symbol_length == 0) {
      $('#search-token').removeClass('ac');
  		$('#search-token').removeClass('wa');
  		$('#table tr').removeClass('state-match');
  		$('#table td').removeClass('symbol-match');
    }

    var first = 'a';
    var last = 'z';
    var states = 0;
    for (i = 0; i < symbol.length; i++) {
      if (symbol[i].charCodeAt(0) >= first.charCodeAt(0) && symbol[i].charCodeAt(0) <= last.charCodeAt(0)) {
        $('#table tr').removeClass('state-match');
        $('#table td').removeClass('symbol-match');
        console.log('aqui!');
        console.log(states);
        console.log(symbol);
        $('#table .states_' + states).addClass('state-match');
        $('#table .word-' + symbol[i]).addClass('symbol-match');
        //console.log(symbol[i]);
        //console.log(state);
        //console.log('teste2');
        console.log(globalTable[states][symbol[i]]); //t?
        if (globalTable[states][symbol[i]] != '-') {
          states = globalTable[states][symbol[i]];
          $( '#search-token').removeClass('ac');
          $( '#search-token').addClass('wa');
        } else {
          $( '#search-token').removeClass('ac');
          $( '#search-token').addClass('wa');
        }
      } else if (symbol[i] == ' ') {
          $('#table tr').removeClass('state_match');
        	$('#table td').removeClass('symbol_match');
        	$('#table .states_' + states).addClass('state_match');
        	$('#table .word-' + symbol[i]).addClass('symbol_match');

          if (globalTable[states]['terminal']) {
            states = 0;
          } else {
            $( '#search-token').removeClass('ac');
            $( '#search-token').addClass('wa');
            break;
          }
      }  else {
         alert('Caractere não suportado: ' + symbol[i]);
         break;
      }
    }
  }
})
