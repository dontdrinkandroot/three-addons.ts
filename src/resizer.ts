import {Camera, PerspectiveCamera, WebGLRenderer} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";

const setSize = (camera: Camera, renderer: WebGLRenderer, composer: EffectComposer | null = null) => {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(pixelRatio);
        if (null != composer) {
            composer.setSize(width, height);
            composer.setPixelRatio(pixelRatio)
        }
        if (camera.type === 'PerspectiveCamera') {
            const perspectiveCamera = camera as PerspectiveCamera
            perspectiveCamera.aspect = width / height;
            perspectiveCamera.updateProjectionMatrix();
        }
        console.log('Resize applied', {width, height, pixelRatio})
    }
};

export class Resizer
{
    constructor(renderer: WebGLRenderer, camera: Camera, public composer: EffectComposer | null = null)
    {
        setSize(camera, renderer, this.composer);

        window.addEventListener('resize', () => {
            setSize(camera, renderer, this.composer);
            this.onResize();
        });
    }

    onResize()
    {
    }
}
