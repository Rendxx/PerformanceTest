﻿(function ($window) {
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
        // callback
        this.onAnimate = null;


        // ----------------------------------------------------------------
        var renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x1099bb });
        document.body.appendChild(renderer.view);

        // create the root of the scene graph
        var stage = new PIXI.Container();

        var container = new PIXI.Container();

        var c2 = new PIXI.Container();
        stage.addChild(container);
        container.addChild(c2);

        c2.position.set(100,100);
        for (var j = 0; j < 5; j++) {

            for (var i = 0; i < 5; i++) {
                var bunny = PIXI.Sprite.fromImage('item.png');
                bunny.x = 40 * i;
                bunny.y = 40 * j;
                c2.addChild(bunny);
            };
        };

        // move container to the (200, 150) 
        container.position.x = 200;
        container.position.y = 150;
        // (93, 98.5) is center of center bunny sprite in local container coordinates
        // we want it to be in (200, 150) of global coords
        container.pivot.x = 80 + 26 * 0.5;
        container.pivot.y = 80 + 37 * 0.5;

        // start animating
        animate();

        function animate() {

            requestAnimationFrame(animate);

            //rotate the container!
            container.rotation -= 0.01;

            // render the root container
            renderer.render(stage);
        }
    };

    $window.Test = Main;
})(window);