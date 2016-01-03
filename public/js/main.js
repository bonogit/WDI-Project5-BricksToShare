$(document).on('ready', function() {
  console.log('sanity check!');

  $('#theme').click(function(){
     $('.list-group').hide();
     $('.list-group_theme').show();
  });
  
  $('#all').click(function(){
    $('.list-group_theme').hide();
    $('.list-group').show();
  });
});



