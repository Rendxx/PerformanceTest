window.PerformanceTest = window.PerformanceTest || {};

(function (TEST) {
    var Para = {
        size: 64,
        width: 40,
        height: 40,
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
            movePos = [];

        // callback
        this.onAnimate = null;

        // public
        this.move = function (x_in, y_in) {
            x += x_in;
            y += y_in;
            if (x > 0) x = 0;
            else if (x < -Para.width * Para.size) x = -Para.width * Para.size;
            if (y < 0) y = 0;
            else if (y > Para.height * Para.size) y = Para.height * Para.size;
        };

        // private
        var animate = function () {
            requestAnimationFrame(animate);

            for (var i = 0; i < Para.moveNumber; i++) {
                movePos[i] = (movePos[i] + 1) % 200;
                _html['moving'][i].css({
                    'top': movePos[i] + 'px'
                });
            }
            _html['scene'].css({
                'top':-y + 'px',
                'left':x + 'px'
            });

            if (that.onAnimate !== null) that.onAnimate();
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
            });
            _html['moving'] = [];
        };

        var _init = function () {
            _setupHtml();
            createItem();
            animate();
        };
        _init();
    };

    TEST.Html = Main;
})(window.PerformanceTest);