var Bonus = function (areasize, grid, id, type) {
    this.x = Math.floor((Math.random() * (areasize[0] - 4 * grid) / grid)) + grid;
    this.y = Math.floor((Math.random() * (areasize[1] - 4 * grid) / grid)) + grid;
    this.grid = grid;
    this.id = id;
    this.type = type;
};

Bonus.prototype = {
    setGrid: function (grid) {
        this.grid = grid;
    },
    draw: function () {
        var $b = $("<div style='left:" + this.x * this.grid + "px;top:" + this.y * this.grid + "px' id='" + this.id + "'/>");

        switch (this.type) {
            case 0:
                $b.addClass("skull");
                break;
            case 1:
                $b.addClass("speedup");
                break;
        }

        $("#bonus").append($b);

    },
    highLight: function () {
        var $point = $("<div style='left:" + this.x* this.grid + "px;top:" + this.y* this.grid + "px'/>");
        $point.addClass("trans green");
        $("#atack").append($point);
        setTimeout(function () {
            $point.addClass("big");
        }, 100);
    }
};