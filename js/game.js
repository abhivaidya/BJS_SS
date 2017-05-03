var Game = (function () {
    function Game(canvasElement) {
        var _this = this;
        this.speed = 0.05;
        this.noofcliffs = 30;
        this.nooftrees = 30;
        BABYLON.Engine.ShadersRepository = "shaders/";
        var canvas = document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(canvas, true);
        this.engine.enableOfflineSupport = false;
        this.assets = [];
        this.scene = null;
        this.cliffs = [];
        this.trees = [];
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this.initScene();
    }
    Game.prototype.initScene = function () {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color3.FromInts(0, 163, 136);
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.02;
        this.scene.fogColor = new BABYLON.Color3(0.8, 0.83, 0.8);
        var camera = new BABYLON.ArcRotateCamera('ArcRotCam', -0.65, 1.35, 10, new BABYLON.Vector3(0, 2, 10), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        var light = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-10, -10, -10), this.scene);
        light.intensity = 1.5;
        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
        this.shadowGenerator.setDarkness(0.5);
        this.shadowGenerator.useBlurVarianceShadowMap = true;
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
                for (var _i = 0, _a = _this.cliffs; _i < _a.length; _i++) {
                    var cliff = _a[_i];
                    cliff.position.z -= _this.speed;
                    if (cliff.position.z < -6) {
                        cliff.position.z = (_this.cliffs.length - 1) * 3;
                    }
                }
                for (var _b = 0, _c = _this.trees; _b < _c.length; _b++) {
                    var tree = _c[_b];
                    tree.position.z -= _this.speed;
                    if (tree.position.z < -10) {
                        tree.position.z = tree.position.z + 175;
                    }
                }
            });
            _this._runGame();
        });
    };
    Game.prototype._init = function () {
        this.scene.debugLayer.show();
        this.prepWorld();
    };
    Game.prototype.prepWorld = function (assetToUse) {
        if (assetToUse === void 0) { assetToUse = null; }
        var skybox = BABYLON.Mesh.CreateSphere("skyBox", 10, 250, this.scene);
        var shader = new BABYLON.ShaderMaterial("gradient", this.scene, "gradient", {});
        shader.setFloat("offset", 0);
        shader.setFloat("exponent", 0.6);
        shader.setColor3("topColor", BABYLON.Color3.FromInts(0, 119, 255));
        shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240, 240, 255));
        shader.backFaceCulling = false;
        skybox.material = shader;
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 200, subdivisions: 2, updatable: false }, this.scene);
        ground.material = new BABYLON.StandardMaterial("groundMat", this.scene);
        ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
        ground.material.specularColor = BABYLON.Color3.Black();
        ground.receiveShadows = true;
        ground.position.x = -50.5;
        ground.position.z = 100;
        for (var i = 0; i < this.noofcliffs; i++) {
            var cliff_asset = this.createAsset("Grey_Cliff", Game.INSTANCE);
            cliff_asset.position.y = -6.5;
            cliff_asset.position.z = i * 3;
            cliff_asset.scaling.z = 3;
            this.cliffs.push(cliff_asset);
        }
        for (var i = 0; i < this.nooftrees; i++) {
            var treeName = "Tree0" + (Math.round(Math.random() * 2 + 1)).toString();
            var tree_asset = this.createAsset(treeName, Game.INSTANCE);
            tree_asset.position.x = -10;
            if (i > 0)
                tree_asset.position.z = this.trees[this.trees.length - 1].position.z + Math.round(Math.random() * 20);
            else
                tree_asset.position.z = 5;
            this.shadowGenerator.getShadowMap().renderList.push(tree_asset);
            this.trees.push(tree_asset);
        }
    };
    Game.prototype.createAsset = function (name, mode, newName) {
        if (mode === void 0) { mode = Game.SELF; }
        if (newName === void 0) { newName = ''; }
        var mesh = this.scene.getMeshByName(name);
        var res = null;
        switch (mode) {
            case Game.SELF:
                res = mesh;
                mesh.setEnabled(true);
                break;
            case Game.CLONE:
                res = mesh.clone(newName);
                break;
            case Game.INSTANCE:
                res = mesh.createInstance(newName);
                break;
        }
        return res;
    };
    Game.prototype._runGame = function () {
    };
    Game.prototype.showAxis = function (size) {
        var axisX = BABYLON.Mesh.CreateLines("axisX", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], this.scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var xChar = this.makeTextPlane("X", "red", size / 10);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], this.scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = this.makeTextPlane("Y", "green", size / 10);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], this.scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = this.makeTextPlane("Z", "blue", size / 10);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    };
    Game.prototype.makeTextPlane = function (text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, this.scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", { size: size }, this.scene);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        return plane;
    };
    return Game;
}());
Game.SELF = 0;
Game.CLONE = 1;
Game.INSTANCE = 2;
window.addEventListener("DOMContentLoaded", function () {
    new Game('renderCanvas');
});
