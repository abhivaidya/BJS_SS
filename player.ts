class Player
{
    public body;

    private nb = 27;
    private layers = 3;

    constructor(scene:BABYLON.Scene)
    {
        this.body = new BABYLON.SolidParticleSystem("SPS", scene);
        var box = BABYLON.MeshBuilder.CreateBox("b", {size:1}, scene);
        this.body.addShape(box, this.nb, {positionFunction: this.myPositionFunction});
        box.dispose();

        var mesh = this.body.buildMesh();

        this.body.mesh.position.y = -0.75;
    }

    myPositionFunction(particle, i, s)
    {
        particle.position.x = i % 3 - 1;
        particle.position.y = Math.floor(i / 9) + 1;
        particle.position.z = Math.floor((i % 9) / 3) - 1;
        particle.color = new BABYLON.Color4(particle.position.x + 0.5, particle.position.y  + 0.5, particle.position.z  + 0.5, 1);
    }

    move()
    {
        if(this.body)
        {
            this.body.mesh.rotation.y += 0.01;
        }
    }
}
