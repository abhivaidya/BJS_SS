var Player = (function () {
    function Player(scene) {
        this.nb = 27;
        this.layers = 3;
        this.body = new BABYLON.SolidParticleSystem("SPS", scene);
        var box = BABYLON.MeshBuilder.CreateBox("b", { size: 1 }, scene);
        this.body.addShape(box, this.nb, { positionFunction: this.myPositionFunction });
        box.dispose();
        var mesh = this.body.buildMesh();
        this.body.mesh.position.y = -0.75;
    }
    Player.prototype.myPositionFunction = function (particle, i, s) {
        particle.position.x = i % 3 - 1;
        particle.position.y = Math.floor(i / 9) + 1;
        particle.position.z = Math.floor((i % 9) / 3) - 1;
        particle.color = new BABYLON.Color4(particle.position.x + 0.5, particle.position.y + 0.5, particle.position.z + 0.5, 1);
    };
    Player.prototype.move = function () {
        if (this.body) {
            this.body.mesh.rotation.y += 0.01;
        }
    };
    return Player;
}());
//# sourceMappingURL=player.js.map