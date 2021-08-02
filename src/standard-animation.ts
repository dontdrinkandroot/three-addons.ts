import {Camera, WebGLRenderer} from "three";
import {Scene} from "three/src/Three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {Resizer} from './resizer';

export abstract class StandardAnimation
{
    private startTime!: number
    private lastUpdate!: number
    private frame!: number
    public readonly renderer: WebGLRenderer;
    public readonly scene: Scene;
    private effectComposer: EffectComposer | null;
    public readonly camera: Camera;
    private resizer: Resizer;

    constructor(private readonly canvas: HTMLCanvasElement | undefined = undefined)
    {
        this.renderer = this.buildRenderer(canvas)
        this.camera = this.buildCamera()
        this.scene = this.buildScene()
        this.effectComposer = this.buildEffectComposer(this.renderer)
        this.resizer = new Resizer(this.renderer, this.camera, this.effectComposer)
    }

    private animationFrame()
    {
        let now = Date.now();
        const elapsedMs = now - this.startTime
        const deltaMs = now - this.lastUpdate
        this.lastUpdate = now
        const delta = deltaMs / (1000 / 60)
        this.update(delta, deltaMs, elapsedMs, this.frame)
        if (null !== this.effectComposer) {
            this.effectComposer.render(deltaMs / 1000)
        } else {
            this.renderer.render(this.scene, this.camera)
        }
        this.frame++
        requestAnimationFrame(this.animationFrame.bind(this));
    }

    public run()
    {
        this.startTime = Date.now()
        this.lastUpdate = Date.now()
        this.frame = 0
        requestAnimationFrame(this.animationFrame.bind(this));
    }

    public setEffectComposer(effectComposer: EffectComposer | null)
    {
        this.effectComposer = effectComposer
        this.resizer.composer = effectComposer
    }

    protected buildEffectComposer(renderer: WebGLRenderer): EffectComposer | null
    {
        return null
    }

    protected buildRenderer(canvas: HTMLCanvasElement | undefined): WebGLRenderer
    {
        const renderer = new WebGLRenderer({canvas, antialias: true});
        renderer.physicallyCorrectLights = true
        return renderer
    }

    protected buildScene(): Scene
    {
        return new Scene()
    }

    protected abstract buildCamera(): Camera

    protected abstract update(delta: number, deltaMs: number, elapsedMs: number, frame: number): void
}
