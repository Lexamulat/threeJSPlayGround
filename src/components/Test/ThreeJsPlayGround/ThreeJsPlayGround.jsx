import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import fitDimensions from 'components/helpers/fitDimensions.jsx';


import styles from './ThreeJsPlayGround.scss';


class ThreeJsPlayGround extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
        };
    }
    componentDidMount() {

        if (!WEBGL.isWebGLAvailable()) {
            alert('Your browser does not support webgl')
            return
        }

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        console.log('width', width, 'height', height);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);

        console.log('cam', this.camera)

        this.renderer = new THREE.WebGLRenderer({ canvas: this.mount });
        this.renderer.setSize(width, height);


        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.cube = new THREE.Mesh(geometry, material);

        this.cube.position.x = 2;


        // this.scene.add(this.cube);

        this.cubes = [
            this.addCube(geometry, 0x44aa88, -20),
            this.addCube(geometry, 0x8844aa, 0),
            this.addCube(geometry, 0xaa8844, 20),
        ];





        const materialLine = new THREE.LineBasicMaterial({ color: 0x0000ff });

        const geometry2 = new THREE.Geometry();
        geometry2.vertices.push(new THREE.Vector3(10, 10, 0));
        geometry2.vertices.push(new THREE.Vector3(0, 10, 0));
        // geometry2.vertices.push(new THREE.Vector3(10, 0, 0));

        this.line = new THREE.Line(geometry2, materialLine);

        this.scene.add(this.line);


        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);


        this.animate();

    }

    addCube = (geometry, color, x) => {
        const material = new THREE.MeshBasicMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    animate = () => {

        if (!this.mount) return
        // const width = this.mount.clientWidth;
        // const height = this.mount.clientHeight;


        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();

        }

        this.cubes.forEach((cube, ndx) => {
            
            cube.rotation.x +=0.01;
            // cube.rotation.y +=0.2;
          });

        this.renderer.render(this.scene, this.camera);
        this.frameId = window.requestAnimationFrame(this.animate);

    }

    resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    render() {

        const { width, height } = this.props;

        return (
            <canvas
                className={styles.boardCanvas}
                style={{ width, height }}
                ref={(mount) => {
                    this.mount = mount;
                }}
            />
        );
    }
}


ThreeJsPlayGround = fitDimensions(ThreeJsPlayGround);

export default ThreeJsPlayGround;













































//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const WEBGL = {

    isWebGLAvailable: function () {

        try {

            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

        } catch (e) {

            return false;

        }

    },

    isWebGL2Available: function () {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    },

    getWebGLErrorMessage: function () {

        return this.getErrorMessage(1);

    },

    getWebGL2ErrorMessage: function () {

        return this.getErrorMessage(2);

    },

    getErrorMessage: function (version) {

        var names = {
            1: 'WebGL',
            2: 'WebGL 2'
        };

        var contexts = {
            1: window.WebGLRenderingContext,
            2: window.WebGL2RenderingContext
        };

        var message = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';

        var element = document.createElement('div');
        element.id = 'webglmessage';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if (contexts[version]) {

            message = message.replace('$0', 'graphics card');

        } else {

            message = message.replace('$0', 'browser');

        }

        message = message.replace('$1', names[version]);

        element.innerHTML = message;

        return element;

    }

};