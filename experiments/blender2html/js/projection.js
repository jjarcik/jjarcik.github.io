
// this code is based on czech article:
// http://www2.cs.cas.cz/~horcik/Teaching/applications/node1.html

// Matice, kde jsou ulozeny souradnice bodu krychle
var points;

// Pomocna pole na 4 vrcholy steny po perspektivni transformaci
var vert = [[0,0],[0,0],[0,0],[0,0]];
// Stred canvasu
var x_center = $("canvas").width()/2, y_center = $("canvas").height()/2;
// Meritko velikosti krychle
var scale = 600;
// Posun krychle od oka pozorovatele
var shift = Vector.create([0,0,10]);
// Vektor smeru osy rotace
var r = Vector.create([0,1,0]);
// Uhel o kolik se krychle pootoci v jednom kroku v radianech 
var angle = 0.1;
// Matice linearniho zobrazeni rotace vzhledem ke standardnim bazim
var rot = Matrix.create([[0,0,0],[0,0,0],[0,0,0]]);
// interval id
var intervalid = 0;
// min img width
var optmgwidth = 20;
//
var intervalspeed = 60;

// html vertexy
var $vertex = [];


// Inicializace
function init3d() {

    points = Matrix.create(object3D);

    // prepare html renderer
    for (var i=0; i < object3D.length; i++){
        var $e = $("<span class='vertex'></span>");
        $("#main").append($e);
        $vertex.push($e);
    }

    
     // Spocita matici rotace pro zadany smer osy a uhel o kolik se ma otacet.
     rot = get_rotation_matrix(r,angle); 

    // Nastavi, aby se funkce animate volala kazdy 100ms.
    intervalid = setInterval(animate,intervalspeed);            
}

// Tato funkce se vola pravidelne po 100ms. 
// Vymaze canvas, nakresli krychli a otoci body krychle.
function animate() {
    var canvas = document.getElementById("canvas");  
    if (canvas.getContext) {                        
        var ctx = canvas.getContext("2d");    
        // Vymaz canvas.                            
        ctx.clearRect(0,0,x_center*2,y_center*2);
        // draw model
        draw_model(ctx);  
         // Otoc body v poli points pomoci matice rotace rot.                        
         points = points.multiply(rot);                
     }
 }


 function draw_model(ctx) {
    var i,z,o;
    var normal = 5;
    var myscale = 1;

    // pro kazdy bod spocitej perspektivni projekci
    for(i = 1; i <= object3D.length; i++) { 

        // CANVAS RENDER
        vert = perspective_projection(points.row(i)); 
        ctx.beginPath();    
        ctx.arc(vert[0], vert[1], normal - points.row(i).e(3)*myscale, 0, 2 * Math.PI, true);       
        ctx.stroke();    

         // HTML RENDER
         z = 0 - points.row(i).e(3);
         var htmlelement = $vertex[i-1];
         htmlelement.css({"left" : vert[0], "top" : vert[1], "z-index" : z*10, "opacity": ((z>0.2)?z:0.2)});

        }

    }


// Spocita perspektivni projekci vektoru
function perspective_projection(v) {
    var output = [0,0];

     // posun od pozorovatele.
     v = v.add(shift);  
     // vypocet perspektivni projekce pro x a y
     output[0] = scale * (v.e(1)/v.e(3)) + x_center;    
     output[1] = scale * (-v.e(2)/v.e(3)) + y_center;

     return(output);
 }


// Spocita matici linearniho zobrazeni rotace podle osy "r" o uhel "angle".
function get_rotation_matrix(r,angle) {

    // Matice prechodu od otocene baze (B) ke standardni bazi.
    var coor_matrix = Matrix.create([     
        [0,0,0],[0,0,0],[0,0,0]
        ]);

     // Matice rotace podle osy dane tretim bazovym vektorem.
     var rot_matrix = Matrix.create([     
        [0,0,0],[0,0,0],[0,0,0]
        ]);

    // pomocne vektory. Otocena baze (B) bude (a,b,r).
    var a = Vector.create([0,0,0]);       
    var b = Vector.create([0,0,0]);

    // Kdyz je r nulovy vektor, varuj a nastav ho na [1,1,1].
    if (r.eql(Vector.Zero(3))) {
        r.setElements([1,1,1]);
        console.log("Vektor osy rotace nemuze byt nulovy!");
    }

     // udelej z vektoru r vektor velikosti 1
     r = r.toUnitVector();   

     // vybere vektor velikosti 1 kolmy na vektor r           
     if (r.e(1)!=0 || r.e(2)!=0) {        
        a.setElements([-r.e(2),r.e(1),0]);
        a = a.toUnitVector();              
    }
    else {
        a.setElements([1,0,0]);
    }

    // posledni vektor ziskame vektorovym soucinem
    b = r.cross(a);                      
    // (a,b,r) je nyni usporadana ortonormalni baze

    coor_matrix.setElements([               // napisu jeji prvky jako sloupce matice coor_matrix
        [a.e(1),b.e(1),r.e(1)],             // tim ziskam matici prechodu od baze (a,b,r) ke standardni bazi
        [a.e(2),b.e(2),r.e(2)],             // protoze je baze (a,b,r) ortonormalni, je inverzni matice ke coor_matrix rovna 
        [a.e(3),b.e(3),r.e(3)]              // transponovane matici coor_matrix.
        ]);

     // Matice rotace podle osy dane tretim bazovym vektorem.
     rot_matrix.setElements([             
        [ Math.cos(angle), Math.sin(angle),0],
        [-Math.sin(angle), Math.cos(angle),0],
        [               0,               0,1]
        ]);

    rot_matrix = rot_matrix.multiply(coor_matrix.transpose());  // rot_matrix*(coor_matrix)^T
    rot_matrix = coor_matrix.multiply(rot_matrix);              // coor_matrix*(rot_matrix*(coor_matrix)^T)
    return(rot_matrix);
}  
