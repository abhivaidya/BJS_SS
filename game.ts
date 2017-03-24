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
        //this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        //this.scene.fogDensity = 0.005;

        let camera = new BABYLON.FreeCamera('FreeCam', new BABYLON.Vector3(-50, 55, -60), this.scene);
        //let camera = new BABYLON.FollowCamera('FollowCam', new BABYLON.Vector3(0, 0, 0), this.scene);
        //camera.attachControl(this.engine.getRenderingCanvas());
        /*camera.keysUp.push(87); // "w"
	    camera.keysDown.push(83); // "s"
	    camera.keysLeft.push(65); // "a"
	    camera.keysRight.push(68); // "d"*/
        //camera.wheelPrecision *= 10;

        camera.setTarget(BABYLON.Vector3.Zero());

        //let light = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
        let light = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-10, -10, -10), this.scene);
        light.intensity = 1.5;
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

                //this.player.body.position.z += 0.05;
                //this.player.move();
            });

            this._runGame();
        });
    }

    private _init ()
    {
        this.scene.debugLayer.show();

        //let res = this.createAsset('nature_small');
        //let ship = this.createAsset('ship');

        this.prepWorld();
        this.addPlayer();
    }

    private addPlayer()
    {
        this.player = new Player(this.scene);

        this.shadowGenerator.getShadowMap().renderList.push(this.player.body.mesh);

        //(<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).lockedTarget = this.player.body.mesh;
        //(<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).radius = 15;
        //(<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).rotationOffset = 120;
        //(<BABYLON.FollowCamera>this.scene.getCameraByName('FollowCam')).heightOffset = 5;
        (<BABYLON.FreeCamera>this.scene.getCameraByName('FreeCam')).lockedTarget = this.player.body.mesh;
    }

    private prepWorld(assetToUse:Array<BABYLON.Mesh> = null)
    {
        let ground1 = BABYLON.MeshBuilder.CreateGround("ground", {width:100, height:100, subdivisions:2, updatable:false}, this.scene);
        let groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
        ground1.material = groundMat;
        groundMat.specularColor = BABYLON.Color3.Black();
        //groundMat.wireframe = true;
        ground1.receiveShadows = true;

        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, <BABYLON.DirectionalLight>this.scene.getLightByID('dirLight'));
        this.shadowGenerator.setDarkness(0.5);
        this.shadowGenerator.useBlurVarianceShadowMap = true;
        this.shadowGenerator.bias = 0.0001;
        this.shadowGenerator.blurScale = 2;
    }

    public createAsset(name:string, mode:number = Game.SELF) : Array<BABYLON.AbstractMesh>
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
        window.addEventListener('keydown', (evt) => {
            switch(evt.keyCode)
            {
                case 83:
                    this.player.body.mesh.translate(BABYLON.Vector3.Forward(), 0.025 * this.engine.getDeltaTime());
                    break;
                case 87:
                    this.player.body.mesh.translate(new BABYLON.Vector3(0, 0, -1), 0.025 * this.engine.getDeltaTime());
                    break;
                case 68:
                    this.player.body.mesh.translate(new BABYLON.Vector3(-1, 0, 0), 0.025 * this.engine.getDeltaTime());
                    break;
                case 65:
                    this.player.body.mesh.translate(new BABYLON.Vector3(1, 0, 0), 0.025 * this.engine.getDeltaTime());
                    break;
            }
        });

        window.addEventListener('mousemove', () => {
            let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
            if(pickResult.hit)
                this.player.body.mesh.lookAt(pickResult.pickedPoint);
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new Game('renderCanvas');
});
