import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      perspectiveCamera: any;
      meshStandardMaterial: any;
      pointLight: any;
      bufferGeometry: any;
    }
  }
}

export {};