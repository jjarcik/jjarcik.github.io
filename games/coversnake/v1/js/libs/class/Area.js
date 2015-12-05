var Area = function () {
    // every rectangle uncover the background
    this.rectangles = [];
    //size of the area
    this.size = {x: 0, y: 0};
    // mask of objects
    this.mask;
    //
    this.bonus = [];
    // 
    this.grid = 5;
};

Area.prototype = {
    setSize: function (size) {
        this.size.x = size[0];
        this.size.y = size[1];
    },
    setGrid: function (grid) {
        this.grid = grid;
    },
    createMask: function () {        
        this.mask = new Array(this.size.y / this.grid - 1);
        
        for (var i = 0; i <= this.size.y / this.grid; i++) {
            this.mask[i] = new Array(this.size.x / this.grid);
            for (var j = 0; j <= this.size.x / this.grid + 1; j++) {
               // if ( i === 0 || j===0 || i === this.size.y / this.grid || j === this.size.x / this.grid) {
               // this.mask[i][j] = 1;    
               // } else {
                    this.mask[i][j] = 0;    
               // }
                
            }
        }
    },
  //
    setPoint: function (point, v) {
        if (point.x > 0 && point.y > 0 && point.x < this.size.x && point.y < this.size.y) {
            //console.log("save X:" + point.x + " Y: " + point.y + " (" + this.size.x + ", " + this.size.y + ")");
            try {
               // if (this.mask[point.y / this.grid][point.x / this.grid] === 0) {
                    this.mask[point.y / this.grid][point.x / this.grid] = v;
               // }
            } catch (err) {
                console.error("problem set value " + v + " on ");
                console.error(point);
                console.log(err);
            }
       } 
    },
   //
    getPoint: function (point) {
        if (point.x >= 0 && point.y >= 0 && point.y / this.grid < this.mask.length) {
            try {
                return this.mask[point.y / this.grid][point.x / this.grid];
            } catch (err) {
                console.log(this.mask.length + " / " + point.y / this.grid);
                console.error("problem get Point " + point + " : ");
                console.error(point);
            }
        }
    },
   //
    isFree: function (point) {
        try {
            return (this.mask[point.y / this.grid][point.x / this.grid] === 0);
        } catch (err) {
            console.log(point);
            //console.log();
        }
    },
    //
    safePoints: function () {
        for (var i = 0; i <= this.size.y / this.grid; i++) {
            for (var j = 0; j <= this.size.x / this.grid; j++) {
                if (this.mask[i][j] === 2) {
                    this.mask[i][j] = 1;
                }
            }
        }
       // console.log("safe points success");
    },
    
    // @TODO this could be done with better performance
    clearPath: function () {
        for (var i = 0; i <= this.size.y / this.grid; i++) {
            for (var j = 0; j <= this.size.x / this.grid; j++) {
                if (this.mask[i][j] === 2) {
                    this.mask[i][j] = 0;
                }
            }
        }
    },
  //
  /*
    unsetFly: function (xy) {
        this.mask[xy.y / this.grid][xy.x / this.grid] = 0;
    },
    //
    setFly: function (xy) {
        this.mask[xy.y / this.grid][xy.x / this.grid] = 5;
    },*/
    //
    addBonus: function (bonus, action){
        this.bonus.push({x:bonus.x, y:bonus.y, action:action});
    },
    
    clear:function(){
        this.mask = null;    
        this.bonus = [];        
    }

};