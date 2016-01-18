$(document).on('ready', function() {
  console.log('sanity check!');
 
      $('#datetimepicker1').datepicker();

});

// click event for 'owning set'  
$('#single_own').on('click',function(){
   var that = this;
   $(that).prop("disabled",true);
   var singlesetId = parseInt($(this).closest('.wrap').data('id')[0]);
   // singleset_setid = $(this).closest('.single_details').data('id');
   var userlogId = parseInt($(this).closest('.wrap').data('id')[1]);
   var setDetail = $(this).closest('.single_details').data('id');
   console.log('test on output set id and user id'+singlesetId+'  '+userlogId );
   // console.log('test on output set id:'+singlesetId+" "+singleset_setid);
  $.ajax({
      type: "POST",
      url: '/singleset/own',
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
   var singlesetId = parseInt($(this).closest('.wrap').data('id')[0]);
   // singleset_setid = $(this).closest('.single_details').data('id');
   var userlogId =  parseInt($(this).closest('.wrap').data('id')[1]);
   var setDetail = $(this).closest('.single_details').data('id');
   // console.log('test on output set id:'+singlesetId+" "+singleset_setid);
  $.ajax({
      type: "POST",
      url: '/singleset/want',
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
    url: '/mysets/deleteOwnOrWant',
    dataType: 'json',
    data: { setDeleteId: setDeleteId}
  };
  $.ajax(options).done(function(data){
    $(that).closest('.mysets_record').remove();
  });
});

$('.themeKey').on('click',function(){
  var that = this;
  var searchKey = $(that).text();
  $('#inputsm').val(searchKey);

});

// click event for 'add like'
$('.star').on('click',function(){
   var that = this;
  var storyId = parseInt($(this).closest('.extended').data('id'));
  var likeCount = parseInt($(this).closest('.media-body').data('id'))+1;
  // console.log('storyId: '+ storyId+' and like no: '+ likeCount);
  
  // var options = {
  //   type: "post",
  //   url: '/newstory/addlike',
  //   dataType: 'json',
  //   data:{
  //     storyId: storyId,
  //     like_count: likeCount
  //   }
  // };
  // $.ajax(options).done(function(data){
  //   console.log('the like count: '+likeCount);
  //   $(this).closest('.extended').find('.likeCount').html(likeCount);
  // });

  $.ajax({
      type: "post",
      url: '/newstory/addlike',
      dataType:'json',
      data:{
        storyId: storyId,
        like_count: likeCount
      }
  });
  console.log('the like count: '+likeCount);
    $(this).closest('.extended').find('.likeCount').html(likeCount);

});







