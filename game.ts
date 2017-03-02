/// <reference path = "lib/babylon.d.ts"/>
/// <reference path = "car.ts"/>

class Game
{
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;

    private car:Car;

    constructor(canvasElement:string)
    {
        this._canvas = <HTMLCanvasElement> document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._engine.enableOfflineSupport = false;
    }

    createScene():void
    {
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = new BABYLON.Color3(0.894, 0.878, 0.729);
        /*
        this._scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
        this._scene.fogColor = new BABYLON.Color3(0.968, 0.85, 0.67);
        this._scene.fogStart = 20.0;
        this._scene.fogEnd = 40.0;
        */
        this._scene.debugLayer.show();

        this._camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 5, -20), this._scene);
        this._camera.attachControl(this._canvas, false);
        this._camera.setTarget(BABYLON.Vector3.Zero());

        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 0.2, -20), this._scene);
        //this._light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, 5, 10), this._scene);
        this._light.intensity = 0.75;

        let ground = BABYLON.MeshBuilder.CreateGround('ground1', {width: 100, height: 75, subdivisions: 2}, this._scene);
        let groundMat = new BABYLON.StandardMaterial("groundMat", this._scene);
        ground.material = groundMat;
        groundMat.diffuseColor = BABYLON.Color3.Blue();

        //this.car = new Car(this._scene);

        BABYLON.SceneLoader.ImportMesh("", "assets/3d/", "nature_small.babylon", this._scene, function (newMeshes, particleSystems)
        {
            let range = 100;

            for(var i = 0; i < newMeshes.length; i++)
            {
                if(newMeshes[i].material instanceof BABYLON.MultiMaterial)
                {
                    for(var j = 0; j < (newMeshes[i].material as BABYLON.MultiMaterial).subMaterials.length; j++)
                    {
                        ((newMeshes[i].material as BABYLON.MultiMaterial).subMaterials[j] as BABYLON.StandardMaterial).specularColor = BABYLON.Color3.Black();
                    }
                }

                newMeshes[i].position.x = Math.random() * range - range/2;
                newMeshes[i].position.z = Math.random() * range - range/2;
                newMeshes[i].rotation.y = Math.PI;
                (newMeshes[i] as BABYLON.Mesh).convertToFlatShadedMesh();
            }
        });
    }

    animate():void
    {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let game = new Game('renderCanvas');
    game.createScene();
    game.animate();
});
