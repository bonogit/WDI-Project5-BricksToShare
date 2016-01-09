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

// click event for 'owning set'  
$('#single_own').on('click',function(){
   var that = this;
   $(that).prop("disabled",true);
   var singlesetId = parseInt($(this).closest('.wrap').data('id'));
   // singleset_setid = $(this).closest('.single_details').data('id');
   var userlogId = 1;
   var setDetail = $(this).closest('.single_details').data('id');
   // console.log('test on output set details'+ setDetail);
   // console.log('test on output set id:'+singlesetId+" "+singleset_setid);
  $.ajax({
      type: "POST",
      url: 'http://localhost:3000/singleset/own',
      dataType:'json',
      data:{
        singleset_id: singlesetId,
        userlogId: userlogId,
        set_id: setDetail[0],
        descr: setDetail[1],
        theme: setDetail[2],
        year: setDetail[3],
        img_sm: setDetail[4],
        img_tn: setDetail[5],
        img_big: setDetail[6]
      }
  });
  // $("#single_want").prop("disabled",true);
  var colAdds = parseInt($('#collection_own').text())+1;
  $('#collection_own').text(colAdds);
  var youAdds = parseInt($('#collection_youown').text())+1;
  $('#collection_youown').text(youAdds);
});
  
// click event for 'wanting set'
$('#single_want').on('click',function(){
   var that = this;
   $(that).prop("disabled",true);
   var singlesetId = parseInt($(this).closest('.wrap').data('id'));
   // singleset_setid = $(this).closest('.single_details').data('id');
   var userlogId = 1;
   var setDetail = $(this).closest('.single_details').data('id');
   // console.log('test on output set id:'+singlesetId+" "+singleset_setid);
  $.ajax({
      type: "POST",
      url: 'http://localhost:3000/singleset/want',
      dataType:'json',
      data:{
        singleset_id: singlesetId,
        userlogId: userlogId,
        set_id: setDetail[0],
        descr: setDetail[1],
        theme: setDetail[2],
        year: setDetail[3],
        img_sm: setDetail[4],
        img_tn: setDetail[5],
        img_big: setDetail[6]
      }
  });
  var wantAdds = parseInt($('#collection_want').text())+1;
  $('#collection_want').text(wantAdds);
   $("#single_own").prop("disabled",true);

});

//click event for delete owning
$('.delete_ownorwantbtn').on('click',function(){
  var that=this;
    $(that).prop("disabled",true);
  var setDeleteId = parseInt($(this).closest('.delete_ownership').data('id'));
  var options = {
    type: 'delete',
    url: 'http://localhost:3000/mysets/deleteOwnOrWant',
    dataType: 'json',
    data: { setDeleteId: setDeleteId}
  };
  $.ajax(options).done(function(data){
    $(that).closest('mysets_record').remove();
  });
});

$('.themeKey').on('click',function(){
  var that = this;
  var searchKey = $(that).text();
  $('#inputsm').val(searchKey);

});







