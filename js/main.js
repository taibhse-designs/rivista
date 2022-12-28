// store multiple instances in  the array
var canvasInstances = [];

var brush_size = 100;
var brush_opacity = 0.5;
var brush_color = '#000';
var brush_type = 'pen';

var json;

function savePage2SVG() {
    var i = 0;
    canvasInstances.forEach(function (canvas) {
        i += 1;

        var filedata = canvas.toSVG(); // the SVG file is now in filedata

        var locfile = new Blob([filedata], {
            type: "image/svg+xml;charset=utf-8"
        });
        var locfilesrc = URL.createObjectURL(locfile); //mylocfile);

        // Create an anchor element
        const a = document.createElement('a');

        // Set the anchor element's href to the URL of the Blob object
        a.href = locfilesrc;

        // Set the anchor element's download attribute to the desired file name
        a.download = "test-" + i + ".svg";

        // Append the anchor element to the document
        document.body.appendChild(a);

        // Simulate a mouse click on the anchor element
        a.click();

        // Remove the anchor element from the document
        a.remove();


    });


}


function savePages2JSON(data)
{
    
    json = "text/json;charset=utf-8,"; //blank json before saving all pages
    var i = 0;
     canvasInstances.forEach(function (canvas) {
         i+=1;
         console.log("saving page " + i);
         json = json + "[*page-" + i + "]" + JSON.stringify(canvas) + ",";
         
         
     });
    
  const blob = new Blob([json], {type: 'application/json'});

  // Create an anchor element
  const a = document.createElement('a');

  // Set the anchor element's href to the URL of the Blob object
  a.href = URL.createObjectURL(blob);

  // Set the anchor element's download attribute to the desired file name
  a.download = "test.json";

  // Append the anchor element to the document
  document.body.appendChild(a);

  // Simulate a mouse click on the anchor element
  a.click();

  // Remove the anchor element from the document
  a.remove();
    
   // data.setAttribute("href", "data:"+json);
   // data.setAttribute("download", "rivista.json");
    
    
}
function updateRivistaBrush() {
    
    console.log("Brush Type:" + brush_type);
    console.log("Brush Size:" + brush_size);
    console.log("Brush Opacity:" + brush_opacity);
    console.log("Brush Color:" + brush_color);
    
    
    //loop all canvases and update the brush settings
    canvasInstances.forEach(function (canvas) {
    
    var brush;     
    if (brush_type == "pen") {
    
    //console.log("Brush Type: Pen");
    //set brush to match what current settings are
    brush = new fabric.PSBrush(canvas);
    
    //console.log("Brush Width Set: " + brush_size);
    brush.width = (brush_size * 3);
    brush.color = brush_color;
    brush.disableTouch = false; // disable touch and only use mouse and pen devices - note doesnt seem to work on wacom or ipad, core method needs to be fixed to better detect device
    brush.pressureManager.fallback = 0.3; // fallback value for mouse and touch events

    //brush.simplifyTolerance = 1;
    brush.opacity = brush_opacity;
    //brush.strokeLineCap = "round"; //Line endings style of a brush (one of "butt", "round", "square")
    //brush.strokeLineJoin = "bevel"; //Corner style of a brush (one of "bevil", "round", "miter")
    //brush.simplifyHighestQuality = true;
    //console.log("simplify: " + brush.simplifyTolerance);
    //fabricCanvasObj.freeDrawingBrush = brush;
        

    }else if (brush_type == "marker") {
        
       // console.log("Brush Type: Marker");
       brush = new fabric.Copic(canvas, {
            width: brush_size, // Width of brush
            color: brush_color, // Color of brush
            opacity: brush_opacity // Opacity of brush
        });

    }else if (brush_type == "airbrush") {
        
        //console.log("Brush Type: Spray");
        brush = new fabric.SpraypaintBrush(canvas, {
            width: brush_size, // Width of brush
            color: brush_color, // Color of brush
            opacity: brush_opacity // Opacity of brush
        });

    }else if (brush_type == "crayon") {
        
        //console.log("Brush Type: Crayon");
        brush = new fabric.CrayonBrush(canvas, {
            width: brush_size, // Width of brush
            color: brush_color, // Color of brush
            opacity: brush_opacity // Opacity of brush
        });

    }else if(brush_type == "eraser") {
             

             // Enable EraserBrush:
 brush = new fabric.EraserBrush(canvas);
 brush.width = (brush_size * 3);

             
}
    
     
        //console.log("brush updated");
        canvas.freeDrawingBrush = brush;

    });
    
    $("#brush_size").val(brush_size);
    $("#brush_opacity").val(brush_opacity * 100);
    
    
    console.log("Brush Updated for all Canvases");

}


function addNewCanvas() {

    var content = document.getElementById("content");
    var newcanvas = document.createElement("canvas");




    content.appendChild(newcanvas);
    var fabricCanvasObj = new fabric.Canvas(newcanvas, {
        selection: false,
        controlsAboveOverlay: true,
        centeredScaling: true,
        allowTouchScrolling: true
    });

   /* fabricCanvasObj.on({
        'touch:gesture': function () {
            console.log(' Gesture ');
        },
        'touch:drag': function () {
            console.log(' Dragging ');
        },
        'touch:orientation': function () {
            console.log(' Orientation ');
        },
        'touch:shake': function () {
            console.log(' Shaking ');
        },
        'touch:longpress': function () {
            console.log(' Longpress ');
        }
    });
*/

    fabricCanvasObj.selection = false;
    fabricCanvasObj.draggable = false;
    fabricCanvasObj.isDrawingMode = true;
    fabricCanvasObj.allowTouchScrolling = true;
    fabricCanvasObj.backgroundColor = "#fff";

    //$(fabricCanvasObj).css('touch-action', 'manipulation');

    window.addEventListener('pointerdown', (event) => {
        // Call the appropriate pointer type handler
        switch (event.pointerType) {
            case 'mouse':
                console.log("mouse");
                fabricCanvasObj.isDrawingMode = true;
                fabricCanvasObj.allowTouchScrolling = false;
                //fabricCanvasObj.selection = false;
                //fabricCanvasObj.draggable = false;

                break;
            case 'pen':
                console.log("pen");
                fabricCanvasObj.isDrawingMode = true;
                fabricCanvasObj.allowTouchScrolling = false;
                //fabricCanvasObj.selection = false;
                //fabricCanvasObj.draggable = false;

                break;
            case 'touch':
                console.log("touch");
                fabricCanvasObj.isDrawingMode = false;
                fabricCanvasObj.allowTouchScrolling = true;
                //fabricCanvasObj.selection = true;
                //fabricCanvasObj.draggable = true;

                break;
            default:
                console.log(`pointerType ${event.pointerType} is not supported`);
        }
    }, false);



    //set brush to match what current settings are
    //fabricCanvasObj.freeDrawingBrush.width = parseInt($('#line-width').val());

    //set brush to match what current settings are
    //let brush = new fabric.PSBrush(fabricCanvasObj);
    //var brush_width = parseInt($('#brush_size').val());
    //console.log("Brush Width Set: " + brush_width);
    //brush.width = (brush_width * 3);
    //brush.color = "#000";
    //brush.disableTouch = false; // disable touch and only use mouse and pen devices - note doesnt seem to work on wacom or ipad, core method needs to be fixed to better detect device
    //brush.pressureManager.fallback = 0.3; // fallback value for mouse and touch events

    //brush.simplifyTolerance = 1;
    //brush.opacity = 0.1;
    //brush.strokeLineCap = "round"; //Line endings style of a brush (one of "butt", "round", "square")
    //brush.strokeLineJoin = "bevel"; //Corner style of a brush (one of "bevil", "round", "miter")
    //brush.simplifyHighestQuality = true;
    //console.log("simplify: " + brush.simplifyTolerance);
    //fabricCanvasObj.freeDrawingBrush = brush;
    
          
    
    console.log(screen.width + "px, " + screen.height + "px");
    fabricCanvasObj.setDimensions({
        width: 3508 / 3,
        height: 2480 / 3
    });
    canvasInstances.push(fabricCanvasObj);
    // canvas.fabricCanvasObj = true;

    updateRivistaBrush();


}

// add canvas on click
$('#add_canvas').on("click", function (event) {
    addNewCanvas();
});

/*
// add text on click
$('#add_text').on("click", function(event) {
  canvasInstances.forEach(function(canvas) {
    var Text = new fabric.Textbox('Sample');
    canvas.add(Text).renderAll();
  })
});
// add circle on click
$('#add_circle').on("click", function(event) {
  canvasInstances.forEach(function(canvas) {
    var Circle = new fabric.Circle({
      radius: 50,
      left: 10,
      top: 10
    });
    canvas.add(Circle).renderAll();
  })
});

// add text on click
$('#black_pen').on("click", function(event) {
  canvasInstances.forEach(function(canvas) {
    
    canvas.freeDrawingBrush.width = 20;
    canvas.freeDrawingBrush.color = '#000000';
  })
});


$('#red_pen').on("click", function(event) {
  canvasInstances.forEach(function(canvas) {
   
    canvas.freeDrawingBrush.width = 20;
    canvas.freeDrawingBrush.color = '#FF0000';
    
  })
});
*/

$(document).on('input change', '#brush_size', function (event) {

    //brush value readout to be set here UI
    //console.log("Brush Size: " + $(this).val() + "%");
if($(this).attr('id') == "brush_size"){
    $('#brush-size-preview').css({
        'display': 'flex'
    });
    
    
    $("#tool_size_preview_value").text($(this).val() + "%");


    $('#brush_size_preview_img').css({
        '-webkit-transform': 'translate(-50%, -50%) scale(' + $(this).val() + '%)',
        '-moz-transform': 'translate(-50%, -50%) scale(' + $(this).val() + '%)',
        '-ms-transform': 'translate(-50%, -50%) scale(' + $(this).val() + '%)',
        '-o-transform': 'translate(-50%, -50%) scale(' + $(this).val() + '%)',
        'transform': 'translate(-50%, -50%) scale(' + $(this).val() + '%)'
    });

    event.preventDefault();
    
}

});

$(document).on('input change', '#brush_opacity', function (event) {

    //brush value readout to be set here UI
    //console.log("Brush Opacity: " + $(this).val() + "%");
if($(this).attr('id') == "brush_opacity"){
    $('#brush-opacity-preview').css({
        'display': 'flex'
    });
    
    
    $("#tool_opacity_preview_value").text($(this).val() + "%");
    $('#brush_opacity_preview_img').css({'opacity' : (parseInt($('#brush_opacity').val()).toFixed(2)/100) });

    event.preventDefault();
}
}); 


$("#brush_size").on('touchend click', function (event) {
    //brush size to be set here for fabric js
    //console.log("Brush Size: " + $(this).val() + "%");

    console.log("touch end");

    $('#brush-size-preview').css({
        'display': 'none'
    });
    
    event.preventDefault();

});

$("#brush_opacity").on('touchend click', function (event) {
    //brush size to be set here for fabric js
    //console.log("Brush Size: " + $(this).val() + "%");

    console.log("touch end");

    $('#brush-opacity-preview').css({
        'display': 'none'
    });
    
    event.preventDefault();

});


$('#brush_size').change(function () {
    //canvasInstances.forEach(function (canvas) {
        
        //parse int required or else lines jump around
        //canvas.freeDrawingBrush.width = parseInt($('#brush_size').val()) * 3;
        brush_size = parseInt($('#brush_size').val());
        updateRivistaBrush();

   // })
});

$('#brush_opacity').change(function () {
    canvasInstances.forEach(function (canvas) {

        brush_opacity = parseInt($('#brush_opacity').val()).toFixed(2) / 100;
        updateRivistaBrush();
        //console.log("opacity: " + opac);
        //canvas.freeDrawingBrush.color = 'rgba(0, 0, 0, ' + opac + ')';
        //canvas.freeDrawingBrush.opacity = opac.toFixed(2);
        //$('#size').text(parseInt($(this).val()) + "px");

    })
});



$('#brush-btn').on("click", function (event) {

    $('#brush-fav-menu').css({
        'display': 'flex'
    });



});


//$('#save-btn').on("click", function (event) {

 //  savePages2JSON();

//});


$('#brush-fav-menu button').on("click", function (event) {

    
    brush_type = $(this).attr("data"); //pull brush type from data attribute
    console.log("switch to " + brush_type + " brush");
    updateRivistaBrush(); //update brush properties
    $('#brush-btn').css({'background-image' : $(this).css("background-image")}); //update brush button icon to reflect selected tool
    
    //hide fav brush menu
    $('#brush-fav-menu').css({
        'display': 'none'
    });

});


/*function that takes a hex value and converts it to rgb

usage 

hexToRgb(hex).r  | returns red value
hexToRgb(hex).g  | returns green value
hexToRgb(hex).b  | returns blue value

*/
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Iterate through the colors array and create a button element for each color
for (let i = 0; i < copic_colors.length; i++) {
  const color = copic_colors[i];
  var hex = color.hex;
  var text_color = neuralColor(
    hexToRgb(hex).r,
    hexToRgb(hex).g,
    hexToRgb(hex).b
  );
  const button = $("<button>")
    .addClass("swatch") //add swatch class to buttons
    .text(color.code + "\n" + color.name) //set text name to match colour name
    .css("background-color", color.hex) //set background colour to hex value of colour
    .css("color", text_color == "light" ? "white" : "black"); //set text colour black or white depending on underlying background colour

  // Append the button to the element with the ID "color-swatches"
  $("#color-swatches").append(button);
}

// show and hide the colour menu
$("#colour-preview-btn").click(function () {
  $("#color-picker-tray").toggle();
});

// set colour to clicked swatch
$(".swatch").click(function () {
  /*var color*/brush_color = $(this).css("background-color");
  updateRivistaBrush();
  $("#colour-preview-btn").css("background-color", brush_color/*color*/); //change background colour
  $("#procreate-color-disk").attr("color", brush_color/*color*/);
  $("#color-picker-tray").toggle(); //hide colour menu
    
   
});

$("#procreate-color-disk").bind("change", function (event) {
  console.log($("#procreate-color-disk").attr("color"));
});

// error starts when adding text and circle in console log.
// what i wanted is to use all methods and access all 
// instances in fabric to make all canvas editable


addNewCanvas();