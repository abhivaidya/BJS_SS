var Game = (function () {
    function Game(canvasElement) {
        this._canvas = document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._engine.enableOfflineSupport = false;
    }
    Game.prototype.createScene = function () {
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = new BABYLON.Color3(0.894, 0.878, 0.729);
        this._scene.debugLayer.show();
        this._camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 5, -20), this._scene);
        this._camera.attachControl(this._canvas, false);
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 0.2, -20), this._scene);
        this._light.intensity = 0.75;
        var ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 100, height: 75, subdivisions: 2 }, this._scene);
        var groundMat = new BABYLON.StandardMaterial("groundMat", this._scene);
        ground.material = groundMat;
        groundMat.diffuseColor = BABYLON.Color3.Blue();
        BABYLON.SceneLoader.ImportMesh("", "assets/3d/", "nature_small.babylon", this._scene, function (newMeshes, particleSystems) {
            var range = 100;
            for (var i = 0; i < newMeshes.length; i++) {
                if (newMeshes[i].material instanceof BABYLON.MultiMaterial) {
                    for (var j = 0; j < newMeshes[i].material.subMaterials.length; j++) {
                        newMeshes[i].material.subMaterials[j].specularColor = BABYLON.Color3.Black();
                    }
                }
                newMeshes[i].position.x = Math.random() * range - range / 2;
                newMeshes[i].position.z = Math.random() * range - range / 2;
                newMeshes[i].rotation.y = Math.PI;
                newMeshes[i].convertToFlatShadedMesh();
            }
        });
    };
    Game.prototype.animate = function () {
        var _this = this;
        this._engine.runRenderLoop(function () {
            _this._scene.render();
        });
        window.addEventListener('resize', function () {
            _this._engine.resize();
        });
    };
    return Game;
}());
window.addEventListener("DOMContentLoaded", function () {
    var game = new Game('renderCanvas');
    game.createScene();
    game.animate();
});
//# sourceMappingURL=game.js.map