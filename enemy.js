var Enemy = (function () {
    function Enemy(scene) {
        this.nb = 27;
        this.layers = 3;
        this.body = new BABYLON.SolidParticleSystem("SPS", scene);
        var box = BABYLON.MeshBuilder.CreateBox("b", { size: 1 }, scene);
        this.body.addShape(box, this.nb, { positionFunction: this.myPositionFunction });
        box.dispose();
        var mesh = this.body.buildMesh();
        this.body.mesh.position.y = -0.75;
    }
    Enemy.prototype.myPositionFunction = function (particle, i, s) {
        particle.position.x = i % 3 - 1;
        particle.position.y = Math.floor(i / 9) + 1;
        particle.position.z = Math.floor((i % 9) / 3) - 1;
        particle.color = new BABYLON.Color4(0.07, 0.14, 0.07, 1);
    };
    Enemy.prototype.move = function () {
    };
    return Enemy;
}());
//# sourceMappingURL=enemy.js.map