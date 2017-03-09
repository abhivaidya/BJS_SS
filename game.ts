/// <reference path = "lib/babylon.d.ts"/>

class Game
{
    private engine: BABYLON.Engine;
    public assets: Array<BABYLON.AbstractMesh>;
    public scene: BABYLON.Scene;

    public static SELF : number = 0;
    public static CLONE : number = 1;
    public static INSTANCE : number = 2;

    private shadowGenerator;
    private player;

    constructor(canvasElement:string)
    {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(canvas, true);
        this.engine.enableOfflineSupport = false;

        this.assets = [];
        this.scene = null;

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.initScene();
    }

    private initScene()
    {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.05;

        this.scene.enablePhysics(new BABYLON.Vector3(0, -4, 0), new BABYLON.CannonJSPlugin());

        //let camera = new BABYLON.FreeCamera('FreeCam', new BABYLON.Vector3(0, 5, -20), this.scene);
        let camera = new BABYLON.FollowCamera('FollowCam', new BABYLON.Vector3(0, 0, 0), this.scene);
        //camera.attachControl(this.engine.getRenderingCanvas());
        /*camera.keysUp.push(87); // "w"
	    camera.keysDown.push(83); // "s"
	    camera.keysLeft.push(65); // "a"
	    camera.keysRight.push(68); // "d"*/
        //camera.wheelPrecision *= 10;

        //let light = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
        let light = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-10, -10, -10), this.scene);
        light.intensity *= 1.5;
        //light.diffuse = BABYLON.Color3.FromInts(255, 245, 0);

        let loader = new Preloader(this);
        loader.callback = this.run.bind(this);
        loader.loadAssets();
    }

    private run()
    {
        this.scene.executeWhenReady(() => {

            // Remove loader
            var loader = <HTMLElement> document.querySelector("#splashscreen");
            loader.style.display = "none";

            this._init();

            this.engine.runRenderLoop(() => {
                this.scene.render();

                this.player.body.position.z += 0.05;

            });

            this._runGame();
        });
    }

    private _init ()
    {
        this.scene.debugLayer.show();

        let res = this.createAsset('nature_small');
        let car = this.createAsset('car');

        this.prepWorld(res as Array<BABYLON.Mesh>);

        this.addPlayer(car as Array<BABYLON.Mesh>);
    }

    private addPlayer(asset:Array<BABYLON.Mesh>)
    {
        this.player = new Player(this.scene, asset[0]);

        this.shadowGenerator.getShadowMap().renderList.push(this.player.body);

        (<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).lockedTarget = this.player.body;
        (<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).radius = 15;
        (<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).rotationOffset = 120;
        (<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).heightOffset = 5;

        this.player.body.physicsImpostor = new BABYLON.PhysicsImpostor(this.player.body, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.8, restitution: 0 }, this.scene);
    }

    private prepWorld(assetToUse:Array<BABYLON.Mesh>)
    {
        let range = 100;

        let ground1 = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height:100}, this.scene);
        let ground2 = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height:100}, this.scene);

        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, <BABYLON.DirectionalLight>this.scene.getLightByID('dirLight'));

        for(var i = 0; i < assetToUse.length; i++)
        {
            assetToUse[i].position.x = Math.random() * range - range/2;
            assetToUse[i].position.z = Math.random() * range - range/2;
            assetToUse[i].rotation.y = Math.PI;

            this.shadowGenerator.getShadowMap().renderList.push(assetToUse[i]);
        }

        this.shadowGenerator.setDarkness(0.5);
        this.shadowGenerator.useBlurVarianceShadowMap = true;
        this.shadowGenerator.bias = 0.0001;
        this.shadowGenerator.blurScale = 2;

        ground1.receiveShadows = true;
        ground2.receiveShadows = true;

        ground1.physicsImpostor = new BABYLON.PhysicsImpostor(ground1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
        ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
    }

    public createAsset(name:string, mode:number=Game.SELF) : Array<BABYLON.AbstractMesh>
    {
        let res : Array<BABYLON.AbstractMesh> = [];

        for (let mesh of this.assets[name])
        {
            switch (mode)
            {
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
    }

    private _runGame()
    {
        window.addEventListener('keyup', (evt) => {
            switch(evt.keyCode)
            {
                case 32:
                    console.log("In space!!!!!!!!!");
                    this.player.body.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 6, 0), this.player.body.getAbsolutePosition());
                    break;
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new Game('renderCanvas');
});
