window.PerformanceTest = window.PerformanceTest || {};

(function (TEST) {
    var Para = {
        size: 64,
        width: 140,
        height: 140,
        staticInterval: 4,
        moveNumber: 16
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
            moveItems = [],
            fog = null,
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

            for (var i = 0; i < Para.moveNumber; i++) {
                moveItems[i][0].rotation += i * -Math.PI / 10;
                moveItems[i][0].position.y = movePos[i];
            }
            container.position.x = x;
            container.position.y = y;
            fog.position.x = -x;
            fog.position.y = -y;            

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


            for (var i = 0; i < Para.moveNumber; i++) {
                movePos[i] = (movePos[i] + 1) % 200;
                changeCount[i]++;
                if (changeCount[i] >= 30 + i * 5) {
                    changeCount[i] = 0;

                    moveItems[i][moveItems[i][4]].visible = false;
                    moveItems[i][moveItems[i][4]].stop();

                    moveItems[i][4] = Math.floor(Math.random() * 3) + 1;
                    moveItems[i][moveItems[i][4]].visible = true;
                    moveItems[i][moveItems[i][4]].play();
                }
            }

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
            PIXI.loader.add('item_a', 'a.json').add('item_b', 'b.json').add('item_c', 'c.json').add('fog', 'fog2.png').load(function (loader, resources) {

                var frames = [[],[],[]];

                for (var i = 0; i < 45; i++) {
                    var val = i < 10 ? '0' + i : i;
                    frames[0].push(PIXI.Texture.fromFrame('iconA00' + val));
                    frames[1].push(PIXI.Texture.fromFrame('iconB00' + val));
                    frames[2].push(PIXI.Texture.fromFrame('iconC00' + val));
                }

                movePos = [];
                changeCount = [];
                for (var i = 0; i < Para.moveNumber; i++) {
                    movePos[i] = i * 20;
                    changeCount[i] = i;
                    moveItems[i] = [];
                    var wrap = new PIXI.DisplayObjectContainer();
                    wrap.position.x = 120 + i * 10;
                    wrap.position.y = 60 + i * 40;

                    moveItems[i][0] = wrap;


                    for (var j = 1; j <= 3; j++) {
                        var item = new PIXI.extras.MovieClip(frames[j-1]);
                        item.animationSpeed = 0.5;
                        item.anchor.set(0.5);
                        item.visible = false;
                        wrap.addChild(item);
                        moveItems[i][j] = item;
                    }

                    moveItems[i][1].visible = true;
                    moveItems[i][1].play();
                    moveItems[i][4] = 1;
                    container.addChild(wrap);
                }


                fog = new PIXI.Sprite(resources.fog.texture);
                fog.position.x = 0;
                fog.position.y = 0;
                fog.width = SCREEN_WIDTH;
                fog.height = SCREEN_HEIGHT;
                container.addChild(fog);

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
            moveControl();
        };
        _init();
    };

    TEST.Pixi = Main;
})(window.PerformanceTest);