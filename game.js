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
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysRight.push(68);
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
        var res = this.createAsset('nature_small');
        this.prepWorld(res);
    };
    Game.prototype.prepWorld = function (assetToUse) {
        var range = 100;
        for (var i = 0; i < assetToUse.length; i++) {
            assetToUse[i].position.x = Math.random() * range - range / 2;
            assetToUse[i].position.z = Math.random() * range - range / 2;
            assetToUse[i].rotation.y = Math.PI;
        }
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
            switch (evt.keyCode) {
                case 32:
                    console.log("In space!!!!!!!!!");
                    break;
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