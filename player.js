var Player = (function () {
    function Player(scene, mesh) {
        this.width = 2;
        this.height = 1;
        this.depth = 3;
        this.body = mesh;
        this.body.position.y = this.height / 2 - 0.1;
        this.body.rotation.y = Math.PI;
    }
    return Player;
}());
//# sourceMappingURL=player.js.map