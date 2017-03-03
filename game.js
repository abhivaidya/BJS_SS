var Game = (function () {
    function Game(canvasElement) {
        var _this = this;
        var canvas = document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(canvas, true);
        this.engine.enableOfflineSupport = false;
        this.assets = [];
        this.scene = null;
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this.initScene();
    }
    Game.prototype.initScene = function () {
        this.scene = new BABYLON.Scene(this.engine);
        var camera = new BABYLON.FreeCamera('FreeCam', new BABYLON.Vector3(0, 5, -20), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        var light = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity *= 1.5;
        var loader = new Preloader(this);
        loader.callback = this.run.bind(this);
        loader.loadAssets();
    };
    Game.prototype.run = function () {
        var _this = this;
        this.scene.executeWhenReady(function () {
            var loader = document.querySelector("#splashscreen");
            loader.style.display = "none";
            _this._init();
            _this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
            _this._runGame();
        });
    };
    Game.prototype._init = function () {
        this.scene.debugLayer.show();
        this.createAsset('nature_small');
    };
    Game.prototype.createAsset = function (name, mode) {
        if (mode === void 0) { mode = Game.SELF; }
        var res = [];
        for (var _i = 0, _a = this.assets[name]; _i < _a.length; _i++) {
            var mesh = _a[_i];
            switch (mode) {
                case Game.SELF:
                    mesh.setEnabled(true);
                    res.push(mesh);
                    break;
                case Game.CLONE:
                    res.push(mesh.clone());
                    break;
                case Game.INSTANCE:
                    res.push(mesh.createInstance());
                    break;
            }
        }
        return res;
    };
    Game.prototype._runGame = function () {
        window.addEventListener('keydown', function (evt) {
            if (evt.keyCode == 32) {
            }
        });
    };
    return Game;
}());
Game.SELF = 0;
Game.CLONE = 1;
Game.INSTANCE = 2;
window.addEventListener("DOMContentLoaded", function () {
    new Game('renderCanvas');
});
//# sourceMappingURL=game.js.map