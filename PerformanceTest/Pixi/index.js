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
            item: '<div class="_item"></div>',
            item2: '<div class="_item2"></div>'
        }
    };

    var Main = function () {
        //data
        var that = this,
            _html = {},
            _loadCount = 1,
            x = 0,
            y = 0,
            delta_x = 0,
            delta_y = 0,
            movePos = [],
            changeCount = [],
            SCREEN_WIDTH = 0,
            SCREEN_HEIGHT = 0;

        var renderer, stage, container;

        var img = ['a.gif', 'b.gif', 'c.gif'];
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
            

            renderer.render(stage);

            if (that.onAnimate !== null) that.onAnimate();
        };

        var moveControl = function () {
            x += delta_x;
            y -= delta_y;
            if (x > 0) x = 0;
            else if (x < -Para.width * Para.size) x = -Para.width * Para.size;
            if (y > 0) y = 0;
            else if (y < -Para.height * Para.size) y = Para.height * Para.size;


            //for (var i = 0; i < Para.moveNumber; i++) {
            //    movePos[i] = (movePos[i] + 1) % 200;
            //    _html['moving'][i].css({
            //        'top': movePos[i] + 'px'
            //    });
            //}
            container.position.x = x;
            container.position.y = y;

            setTimeout(moveControl, 30);
        };

        var createItem = function () {
            _loadCount++;
            PIXI.loader.add('staticItem', 'item.png').load(function (loader, resources) {
                var item = new PIXI.Sprite(resources.staticItem.texture);

                for (var i = 0; i < Para.width; i += Para.staticInterval) {
                    for (var j = 0; j < Para.height; j += Para.staticInterval) {
                        var item = new PIXI.Sprite(resources.staticItem.texture);
                        item.position.x = i * Para.size;
                        item.position.y = j * Para.size;
                        container.addChild(item);
                    }
                }

                _onload();
            });

            _loadCount++;
            PIXI.loader.add('item_a', 'a.json').add('item_b', 'b.json').add('item_c', 'c.json').load(function (loader, resources) {

                var frames = [];

                for (var i = 0; i < 45; i++) {
                    var val = i < 10 ? '0' + i : i;
                    frames.push(PIXI.Texture.fromFrame('iconA00' + val));
                }

                movePos = [];
                changeCount = [];
                for (var i = 0; i < Para.moveNumber; i++) {
                    movePos[i] = i * 10;
                    changeCount[i] = i;
                    var item = new PIXI.extras.MovieClip(frames);
                    item.position.x = 120 + i * 2;
                    item.position.y = 60 + i * 40;
                    item.animationSpeed = 0.5;
                    item.anchor.set(0.5);
                    item.play();

                    container.addChild(item);
                }

                _onload();
            });

            _onload();
        };

        var _onload = function () {
            if (--_loadCount > 0) return;
            animate();
        };

        var _setupHtml = function () {
            _html['wrap'] = $('.wrap');
            _html['scene'] = _html['wrap'].children('.scene');
                        
            SCREEN_WIDTH = window.innerWidth;
            SCREEN_HEIGHT = window.innerHeight;
            renderer = new PIXI.WebGLRenderer(SCREEN_WIDTH, SCREEN_HEIGHT);
            _html['scene'][0].appendChild(renderer.view);
            stage = new PIXI.Container();
            container = new PIXI.DisplayObjectContainer()

            _loadCount++;
            var texture = PIXI.Texture.fromImage("grid_bg.png");
            var tilingSprite = new PIXI.TilingSprite(texture, Para.width * Para.size, Para.height * Para.size);
            
            container.addChild(tilingSprite);
            stage.addChild(container);
            _onload();
        };

        var _init = function () {
            _setupHtml();
            createItem();
            animate();
            moveControl();
        };
        _init();
    };

    TEST.Pixi = Main;
})(window.PerformanceTest);