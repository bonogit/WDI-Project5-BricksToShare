var dataset = {};
//get data from rebrickage api
  $('#getData').on('click',function(){
    var options = {
      type: "GET",
      url: 'https://rebrickable.com/api/search?key=oXVdrXnWqv&format=json&type=S',
      dataType: 'json'
    };

    $.ajax(options).done(function(data){
      legoSets = data.results.slice(0,30);
      console.log(legoSets);

     for (var i = 0; i<30; i++) {
      $.ajax({
        type: "POST",
        url: '/brickset',
        dataType: 'json',
        data: {
          // legoSets : legoSets
          set_id: String(data.results[i].set_id),
          descr: String(data.results[i].descr),
          theme: String(data.results[i].theme1),
          year: parseInt(data.results[i].year),
          img_tn: String(data.results[i].img_tn),
          img_sm: String(data.results[i].img_sm),
          img_big: String(data.results[i].img_big)
        }
      });
       
     };
      $('#showData').text('30 records are loaded!');


      //  console.log(data[0]);
      //  $setData.push(data[0].descr);
      // // _.each(data,function(set){
      // //   console.log(set);
      // $('#showData').text(data[0].descr);
      // });
    });
  });