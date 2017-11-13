/*
*
* Lex - Lexical Analysis
*
*/

// main
$( "#form-token" ).submit(function( event ) {
  console.log( "Token .submit() is called." );
  event.preventDefault();

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
});


// show tokens function
