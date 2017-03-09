class Player
{
    private width = 1;
    private height = 3;
    private depth = 1;

    public body;

    constructor(scene:BABYLON.Scene)
    {
        this.body = BABYLON.MeshBuilder.CreateBox("player", {width: this.width, height: this.height, depth:this.depth}, scene);
        this.body.position.y = this.height/2;
    }
}
