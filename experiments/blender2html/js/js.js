/*

    This script loads 3d model from remote file in .obj format
    and inits engine for render model via canvas + pure html.
    You can scroll for zoom, or control rotation by form.

    @author: Jan Jarcik
    https://github.com/jjarcik/

*/

var PATH_TO_FILES = "./obj/";
var DEFAULT_3D_MODEL_FILE = "ring.obj";
var object3D = [];

$(document).ready(function(){  

    var h = window.location.hash;

    loadFile( ( h == "" ) ? DEFAULT_3D_MODEL_FILE : h.substr(1), function(){
        init3d(); 
        keyEventer(); 
    })

})

$(window).resize(function(){ 
    resize();  
})


$(window).load(function(){ 
    resize();
})


function loadFile(filename, callback){
    
    $.ajax({
        url: PATH_TO_FILES + filename
    }).done(function(e){
        var lines = e.split("\n");
        for (var i in lines){
            if (lines[i].substr(0,1) == "v"){
                var blob = lines[i].split(" ");
                object3D.push([blob[1], blob[2], blob[3]]);
            }
        }
        $("#nodes_count").text(object3D.length);
        callback();
        

    }).error(function(e){
        console.error('error');
        console.error(e);
    });
}

function keyEventer(){

    $("#scrollwrap").scrollTop($("#scrollwrap").height()/1); 

    $("#scrollwrap").scroll(function(){
        var s = $(this).scrollTop();        
        scale = s+200;
    })
    
    $(":checkbox").click(function(){                
        var checked = {0:$(":checkbox:eq(0)").is(':checked')?1:0,1:$(":checkbox:eq(1)").is(':checked')?1:0,2:$(":checkbox:eq(2)").is(':checked')?1:0, 3:$(":checkbox:eq(3)").is(':checked')};
        if (checked[0] == 0 && checked[1] == 0 && checked[2] == 0){
            clearInterval(intervalid);
            intervalid = 0;
            return;
        }
        
        r = Vector.create([checked[0],checked[1],checked[2]]);
        rot = get_rotation_matrix(r,angle);       
        
        if (intervalid == 0){
          intervalid = setInterval(animate,intervalspeed); 
        }

        if (checked[3]){
            $("#main").addClass("bitmaps");
        } else {
            $("#main").removeClass("bitmaps");
        }
  })
    
    $(":text").change(function(){
        intervalspeed = parseInt($(this).val());
        clearInterval(intervalid);
        intervalid = setInterval(animate,intervalspeed); 
    })
    
}

function resize(){
    $("#main").width($(window).width()/2).height($(window).height());
    $("canvas").attr("width",($(window).width()/2)).attr("height",($(window).height()));
    x_center = $("canvas").width()/2, y_center = $("canvas").height()/2;
}

function reload(form){
    window.location.href = './#'  + ($(form).find("option:selected").val());
    location.reload();
    return false;
}