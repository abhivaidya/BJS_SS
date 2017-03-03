/// <reference path = "lib/babylon.d.ts"/>

class Game
{
    private engine: BABYLON.Engine;
    public assets: Array<BABYLON.AbstractMesh>;
    public scene: BABYLON.Scene;

    public static SELF : number = 0;
    public static CLONE : number = 1;
    public static INSTANCE : number = 2;

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

        let camera = new BABYLON.FreeCamera('FreeCam', new BABYLON.Vector3(0, 5, -20), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        //camera.wheelPrecision *= 10;

        let light = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity *= 1.5;

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
            });

            this._runGame();
        });
    }

    private _init ()
    {
        this.scene.debugLayer.show();

        this.createAsset('nature_small');
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
        window.addEventListener('keydown', (evt) => {
            if (evt.keyCode == 32)
            {

            }
        })
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new Game('renderCanvas');
});
