function Chart(container_id)
{
  var chart = $("#"+container_id).get(0);
  var context = chart.getContext("2d");
  var data;

  var width = $("#"+container_id).width();
  var height = $("#"+container_id).height();

  chart.setAttribute('width', width + "px");
  chart.setAttribute('height', height + "px");

  this.redraw = function(){
    chart = $("#"+container_id).get(0);
    context = chart.getContext("2d");

    width = $("#"+container_id).width();
    height = $("#"+container_id).height();

    //Clear and start
    context.clearRect (0, 0, width, height);
    context.beginPath();

    for(i = 0; i < data.length; i++){
      //Berechne Koordinaten
      var x = data[i].x;
      var y = data[i].y;

      var chartx = (x - minX) / (maxX - minX);
      var charty = 1 - ((y - minY) / (maxY - minY));

    //console.log(chartx + " " + charty);
    console.log("H:" + height + " W:" + width);

    chartx = Math.floor(chartx * width);
    charty = Math.floor(charty * height);

    //console.log(chartx + " " + charty);

      //Einzeichnen
      if(i === 0)
        context.moveTo(chartx, charty);
      else
        context.lineTo(chartx, charty);
    }

    //Pfad einzeichnen
    context.stroke();
  };

  var maxX = -100000000000000;
  var minX = 100000000000000;
  var maxY = -100000000000000;
  var minY = 100000000000000;


  this.calcExtrema = function(){
    for(i = 0; i < data.length; i++){
      var x = data[i].x;
      if(x > maxX)
        maxX = x;

      if(x < minX)
        minX = x;

      var y = data[i].y;
      if(y > maxY)
        maxY = y;

      if(y < minY)
        minY = y;
    }

    //console.log("X: " + maxX + " <-> " + minX);
    //console.log("Y: " + maxY + " <-> " + minY);
  };

  this.setData = function(json){
    data = jQuery.parseJSON(json);
    this.calcExtrema();
    //console.log(data);
  };
}
