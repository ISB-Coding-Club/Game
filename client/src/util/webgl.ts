import WebGL from "three/examples/jsm/capabilities/WebGL";

export const checkWebGL = (): boolean => {
    if (WebGL.isWebGLAvailable()) {
        return true;
    } else {
        const warning = WebGL.getWebGLErrorMessage();
        document.body.appendChild(warning);
        return false;
    }
};
