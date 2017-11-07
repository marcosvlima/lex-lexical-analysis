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
  var html_eol = $( "<br>")
  $('.registered-tokens').prepend(html_dicionario_div);
  var tokens_size = tokens.length;
  for (i = 0; i < tokens_size; i++) {
    $('#list-tokens').prepend(tokens[i], html_eol);
  }

  var states = [[]];
  var next = 0;
  var overview = 0;
  for (i = 0; i < tokens_size; i++) {
    var iterator_tokens = tokens[i];
    var current = 0;

    for (j = 0; j < iterator_tokens.length; j++) {
      //var teste = states[initial_state][iterator_tokens];
      var type = typeof states[current][iterator_tokens];
      // console.log(type);
      if (type === typeof undefined){
        //console.log('Is a undefined')
        next = overview + 1;
        //console.log(next);
        states[current][iterator_tokens[j]] = next;
        //console.log(states);
        states[next] = [];
        //console.log(states);
        overview = current = next;

      } else {
        //console.log('defined');
        current = states[current][iterator_tokens[j]];
      }
      if (j == iterator_tokens.length -1) {
        states[current]['terminal'] = true;
      }
    }
    console.log(states); //-> states debug  
  }
});
