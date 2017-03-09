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
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.05;
        this.scene.enablePhysics(new BABYLON.Vector3(0, -4, 0), new BABYLON.CannonJSPlugin());
        var camera = new BABYLON.FollowCamera('FollowCam', new BABYLON.Vector3(0, 0, 0), this.scene);
        var light = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-10, -10, -10), this.scene);
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
                _this.player.body.position.z += 0.05;
            });
            _this._runGame();
        });
    };
    Game.prototype._init = function () {
        this.scene.debugLayer.show();
        var res = this.createAsset('nature_small');
        this.prepWorld(res);
        this.addPlayer();
    };
    Game.prototype.addPlayer = function () {
        this.player = new Player(this.scene);
        this.shadowGenerator.getShadowMap().renderList.push(this.player.body);
        this.scene.getCameraByName('FollowCam').lockedTarget = this.player.body;
        this.scene.getCameraByName('FollowCam').radius = 15;
        this.scene.getCameraByName('FollowCam').rotationOffset = 120;
        this.scene.getCameraByName('FollowCam').heightOffset = 5;
        this.player.body.physicsImpostor = new BABYLON.PhysicsImpostor(this.player.body, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.8, restitution: 0 }, this.scene);
    };
    Game.prototype.prepWorld = function (assetToUse) {
        var range = 100;
        var ground1 = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene);
        var ground2 = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene);
        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.scene.getLightByID('dirLight'));
        for (var i = 0; i < assetToUse.length; i++) {
            assetToUse[i].position.x = Math.random() * range - range / 2;
            assetToUse[i].position.z = Math.random() * range - range / 2;
            assetToUse[i].rotation.y = Math.PI;
            this.shadowGenerator.getShadowMap().renderList.push(assetToUse[i]);
        }
        this.shadowGenerator.setDarkness(0.5);
        this.shadowGenerator.useBlurVarianceShadowMap = true;
        ground1.receiveShadows = true;
        ground2.receiveShadows = true;
        ground1.physicsImpostor = new BABYLON.PhysicsImpostor(ground1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
        ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
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
        var _this = this;
        window.addEventListener('keyup', function (evt) {
            switch (evt.keyCode) {
                case 32:
                    console.log("In space!!!!!!!!!");
                    _this.player.body.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 6, 0), _this.player.body.getAbsolutePosition());
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