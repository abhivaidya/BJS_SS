var Player = (function () {
    function Player(scene) {
        this.width = 1;
        this.height = 3;
        this.depth = 1;
        this.body = BABYLON.MeshBuilder.CreateBox("player", { width: this.width, height: this.height, depth: this.depth }, scene);
        this.body.position.y = this.height / 2;
    }
    return Player;
}());
//# sourceMappingURL=player.js.map