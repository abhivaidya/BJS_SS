/// <reference path = "../lib/babylon.d.ts"/>

class Game
{
    private engine: BABYLON.Engine;
    public assets: Array<BABYLON.AbstractMesh>;
    public scene: BABYLON.Scene;

    private cliffs: Array<BABYLON.AbstractMesh>;
    private trees: Array<BABYLON.AbstractMesh>;

    public speed = 0.05;

    private noofcliffs = 30;
    private nooftrees = 30;

    public static SELF : number = 0;
    public static CLONE : number = 1;
    public static INSTANCE : number = 2;

    private shadowGenerator;

    constructor(canvasElement:string)
    {
        BABYLON.Engine.ShadersRepository = "shaders/";

        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(canvas, true);
        this.engine.enableOfflineSupport = false;

        this.assets = [];
        this.scene = null;

        this.cliffs = [];
        this.trees = [];

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.initScene();
    }

    private initScene()
    {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color3.FromInts(0, 163, 136);
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.02;
        this.scene.fogColor = new BABYLON.Color3(0.8, 0.83, 0.8);

        let camera = new BABYLON.ArcRotateCamera('ArcRotCam', -0.65, 1.35, 10, new BABYLON.Vector3(0, 2, 10), this.scene);
        //let camera = new BABYLON.FreeCamera('FreeCam', new BABYLON.Vector3(-50, 55, -60), this.scene);
        //let camera = new BABYLON.FollowCamera('FollowCam', new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        /*camera.keysUp.push(87); // "w"
	    camera.keysDown.push(83); // "s"
	    camera.keysLeft.push(65); // "a"
	    camera.keysRight.push(68); // "d"*/
        //camera.wheelPrecision *= 10;

        //let light = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
        let light = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-10, -10, -10), this.scene);
        light.intensity = 1.5;
        //light.diffuse = BABYLON.Color3.FromInts(255, 245, 0);

        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
        this.shadowGenerator.setDarkness(0.5);
        this.shadowGenerator.useBlurVarianceShadowMap = true;
        //this.shadowGenerator.bias = 0.0001;
        //this.shadowGenerator.blurScale = 2;

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

                for (let cliff of this.cliffs)
                {
                    cliff.position.z -= this.speed;
                    if(cliff.position.z < -6)
                    {
                        cliff.position.z = (this.cliffs.length - 1) * 3;
                    }
                }

                for (let tree of this.trees)
                {
                    tree.position.z -= this.speed;
                    if(tree.position.z < -10)
                    {
                        tree.position.z = tree.position.z + 175;
                    }
                }
            });

            this._runGame();
        });
    }

    private _init ()
    {
        this.scene.debugLayer.show();
        //this.showAxis(15);
        this.prepWorld();
    }

    private prepWorld(assetToUse:Array<BABYLON.Mesh> = null)
    {
        var skybox = BABYLON.Mesh.CreateSphere("skyBox", 10, 250, this.scene);

        var shader = new BABYLON.ShaderMaterial("gradient", this.scene, "gradient", {});
        shader.setFloat("offset", 0);
        shader.setFloat("exponent", 0.6);
        shader.setColor3("topColor", BABYLON.Color3.FromInts(0, 119, 255));
        shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240, 240, 255));
        shader.backFaceCulling = false;
        skybox.material = shader;

        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width:100, height:200, subdivisions:2, updatable:false}, this.scene);
        ground.material = new BABYLON.StandardMaterial("groundMat", this.scene);
        (ground.material as BABYLON.StandardMaterial).diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
        (ground.material as BABYLON.StandardMaterial).specularColor = BABYLON.Color3.Black();
        //groundMat.wireframe = true;
        ground.receiveShadows = true;
        ground.position.x = -50.5;
        ground.position.z = 100;

        for (let i = 0; i < this.noofcliffs; i++)
        {
            let cliff_asset = this.createAsset("Grey_Cliff", Game.INSTANCE);
            cliff_asset.position.y = -6.5;
            cliff_asset.position.z = i * 3;

            cliff_asset.scaling.z = 3;

            this.cliffs.push(cliff_asset);
        }

        for (let i = 0; i < this.nooftrees; i++)
        {
            let treeName = "Tree0" + (Math.round(Math.random() * 2 + 1)).toString();

            let tree_asset = this.createAsset(treeName, Game.INSTANCE);
            tree_asset.position.x = -10;

            if(i > 0)
                tree_asset.position.z = this.trees[this.trees.length - 1].position.z + Math.round(Math.random() * 20);
            else
                tree_asset.position.z = 5;

            this.shadowGenerator.getShadowMap().renderList.push(tree_asset);

            this.trees.push(tree_asset);
        }
    }

    public createAsset(name:string, mode:number = Game.SELF, newName:string = '') : BABYLON.Mesh
    {
        let mesh : BABYLON.Mesh = <BABYLON.Mesh> this.scene.getMeshByName(name);

        let res = null;
        switch (mode)
        {
            case Game.SELF:
                res = mesh;
                mesh.setEnabled(true);
                break;

            case Game.CLONE:
                res = mesh.clone(newName);
                break;

            case Game.INSTANCE:
                res = mesh.createInstance(newName);
                break;
        }

        return res;
    }

    private _runGame()
    {

    }

    private showAxis(size)
    {
        var axisX = BABYLON.Mesh.CreateLines("axisX", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ], this.scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);

        var xChar = this.makeTextPlane("X", "red", size / 10);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], this.scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);

        var yChar = this.makeTextPlane("Y", "green", size / 10);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], this.scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);

        var zChar = this.makeTextPlane("Z", "blue", size / 10);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    }

    private makeTextPlane(text, color, size)
    {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, this.scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", {size: size}, this.scene);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
        plane.material.backFaceCulling = false;
        (plane.material as BABYLON.StandardMaterial).specularColor = new BABYLON.Color3(0, 0, 0);
        (plane.material as BABYLON.StandardMaterial).diffuseTexture = dynamicTexture;
        return plane;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new Game('renderCanvas');
});
