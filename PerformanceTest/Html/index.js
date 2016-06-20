window.PerformanceTest = window.PerformanceTest || {};

(function (TEST) {
    var Para = {
        size: 64,
        width: 30,
        height: 30,
        staticInterval: 4,
        moveNumber: 6
    };

    var Data = {
        html: {
            item: '<div class="_item"></div>'
        }
    };

    var Main = function () {
        //data
        var that = this,
            _html = {},
            x = 0,
            y = 0,
            delta_x = 0,
            delta_y = 0,
            movePos = [];

        // callback
        this.onAnimate = null;

        // public
        this.move = function (x_in, y_in) {
            delta_x = x_in;
            delta_y = y_in;
        };

        // private
        var animate = function () {
            requestAnimationFrame(animate);


            for (var i = 0; i < Para.moveNumber; i++) {
                _html['moving'][i].css({
                    'transform': 'rotate(' + i * -40 + 'deg) translateY(' + movePos[i] + 'px)'
                });
            }
            _html['scene'].css({
                'transform': 'translate('+x + 'px,'+(-y)+'px)'
            });

            if (that.onAnimate !== null) that.onAnimate();
        };

        var moveControl = function () {
            x += delta_x;
            y += delta_y;
            if (x > 0) x = 0;
            else if (x < -Para.width * Para.size) x = -Para.width * Para.size;
            if (y < 0) y = 0;
            else if (y > Para.height * Para.size) y = Para.height * Para.size;


            //for (var i = 0; i < Para.moveNumber; i++) {
            //    movePos[i] = (movePos[i] + 1) % 200;
            //    _html['moving'][i].css({
            //        'top': movePos[i] + 'px'
            //    });
            //}
            //_html['scene'].css({
            //    'top':-y + 'px',
            //    'left':x + 'px'
            //});

            for (var i = 0; i < Para.moveNumber; i++) {
                movePos[i] = (movePos[i] + 1) % 200;
            }
            setTimeout(moveControl, 30);
        };

        var createItem = function () {
            for (var i = 0; i < Para.width; i += Para.staticInterval) {
                for (var j = 0; j < Para.height; j += Para.staticInterval) {
                    $(Data.html.item).css({
                        'left': i * Para.size + 'px',
                        'top': j * Para.size + 'px'
                    }).appendTo(_html['staticItem']);
                }
            }
            for (var i = 0; i < Para.moveNumber; i++) {
                movePos[i] = i * 10;
                _html['moving'][i] = $(Data.html.item).css({
                    'left': i * 40 + 'px'
                }).appendTo(_html['moveItem']);
            }
        };

        var _setupHtml = function () {
            _html['wrap'] = $('.wrap');
            _html['scene'] = _html['wrap'].children('.scene');
            _html['moveItem'] = _html['scene'].children('._move').css({
                width: Para.width * Para.size,
                height: Para.height * Para.size
            });
            _html['staticItem'] = _html['scene'].children('._static').css({
                width: Para.width * Para.size,
                height: Para.height * Para.size
            });
            _html['bg'] = _html['scene'].children('._bg').css({
                width: Para.width * Para.size,
                height: Para.height * Para.size
            }).attr({
                width: Para.width * Para.size,
                height: Para.height * Para.size
            });
            _html['moving'] = [];

            // canvas

            var img = new Image();
            img.onload = function () {
                var ctx = _html['bg'][0].getContext("2d");
                ctx.save();
                var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
                ctx.fillStyle = ptrn;
                ctx.fillRect(0, 0, Para.width * Para.size, Para.height * Para.size);
                ctx.restore();
            };
            img.src = 'grid_bg.png';
        };

        var _init = function () {
            _setupHtml();
            createItem();
            animate();
            moveControl();
        };
        _init();
    };

    TEST.Html = Main;
})(window.PerformanceTest);