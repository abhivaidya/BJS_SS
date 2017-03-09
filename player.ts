class Player
{
    private width = 2;
    private height = 1;
    private depth = 3;

    public body;

    constructor(scene:BABYLON.Scene, mesh:BABYLON.Mesh)
    {
        //this.body = BABYLON.MeshBuilder.CreateBox("player", {width: this.width, height: this.height, depth:this.depth}, scene);
        this.body = mesh;
        this.body.position.y = this.height/2 - 0.1;
        this.body.rotation.y = Math.PI;
    }
}
