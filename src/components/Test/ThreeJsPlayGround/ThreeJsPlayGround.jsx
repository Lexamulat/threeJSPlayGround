import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import fitDimensions from 'components/helpers/fitDimensions.jsx';


import styles from './ThreeJsPlayGround.scss';


import Stats from 'stats.js';
const OrbitControls = require('three-orbit-controls')(THREE);

class ThreeJsPlayGround extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    initiateCamera = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0A233D);
        const fov = 75;
        const aspect = width / height;
        const near = 0.1;
        const far = 3000;

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.mount, antialias: false });
        this.renderer.setSize(width, height);

        // this.camera.position.set(-20, 30, 100);
        this.camera.position.set(0, 0, 100);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);


        //reset controls btns
        this.controls.mouseButtons = {
            ORBIT: 2,
            ZOOM: 1,
            PAN: 0
        }

        // this.controls.screenSpacePanning = true;

        // this.controls.target.set( x, y, z );
        // this.camera.lookAt();

        // this.controls.enableRotate = false;


        // this.camera.lookAt(0, 0, 0);

    }

    addAsixs = () => {
        //x
        const materialLineX = new THREE.LineBasicMaterial({ color: 'blue' });
        const geometryX = new THREE.Geometry();
        geometryX.vertices.push(new THREE.Vector3(-50, 0, 0));
        geometryX.vertices.push(new THREE.Vector3(50, 0, 0));

        this.lineX = new THREE.Line(geometryX, materialLineX);
        //y
        const materialLineY = new THREE.LineBasicMaterial({ color: 'yellow' });
        const geometryY = new THREE.Geometry();
        geometryY.vertices.push(new THREE.Vector3(0, -50, 0));
        geometryY.vertices.push(new THREE.Vector3(0, 50, 0));

        this.lineY = new THREE.Line(geometryY, materialLineY);

        //z
        const materialLineZ = new THREE.LineBasicMaterial({ color: 'red' });
        const geometryZ = new THREE.Geometry();
        geometryZ.vertices.push(new THREE.Vector3(0, 0, -50));
        geometryZ.vertices.push(new THREE.Vector3(0, 0, 50));

        this.lineZ = new THREE.Line(geometryZ, materialLineZ);

        this.scene.add(this.lineX);
        this.scene.add(this.lineY);
        this.scene.add(this.lineZ);

    }


    statsInit = () => {
        this.stats1 = new Stats();
        this.stats1.showPanel(0);

        this.refs.stats.appendChild(this.stats1.dom);

        this.stats2 = new Stats();
        this.stats2.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
        this.stats2.showPanel(2);

        this.refs.stats.appendChild(this.stats2.dom);
    }

    handlePressAndReplaceCam = (event) => {
        let code = event ?.keyCode;

        const step = 5;
        //37-←  38-↑  39-→ 40-↓  
        console.log('key', code);

        // w a s d
        if (code == 87) code = 38;
        else if (code == 83) code = 40;
        else if (code == 65) code = 37;
        else if (code == 68) code = 39;


        switch (code) {
            case 38:
                //up
                // this.camera.position.setX(this.camera.position.x + 1);
                this.camera.position.setY(this.camera.position.y + step);
                break;
            case 40:
                //down
                // this.camera.position.setY(this.camera.position.y + 1);
                this.camera.position.setY(this.camera.position.y - step);
                break;
            case 37:
                //left
                this.camera.position.setX(this.camera.position.x - step);
                break;
            case 39:
                //right
                this.camera.position.setX(this.camera.position.x + step);
                break;
            default:
                console.log('unused key pressed')
        }

    }
    handleClick = (event) => {
        // console.log('click event', event.type);
        // this.camera.getWorldDirection(dirVector);
        // console.log('GET IT', this.camera.getWorldDirection())

        // let vector = new THREE.Vector3(0, 0, -1);
        // vector.applyQuaternion(this.camera.quaternion);

        // const { x, y, z } = vector
        // console.log('x, y, z', x, y, z)
        // this.controls.target.set(x, y, z+10);
        // this.camera.position.copy(this.controls.center).add(new THREE.Vector3(x, y, z+10));

        // const vector = new THREE.Vector3( 0, 0, - 1 );

    }

    handleMouseMove = (event) => {
        //!! note that react synchetic event is always empty cause its always reused 
        //work only with active mouse left button
        if (event.buttons != 1) return;
        this.camera.position.setX(this.camera.position.x - event.movementX);

        // console.log('move event', event.movementX);

    }

    handleMouseUp = (event) => {
        console.log('UP');
        document.removeEventListener("mousemove", this.handleMouseMove, false);
    }

    addCameraControls = () => {
        document.addEventListener("keydown", this.handlePressAndReplaceCam, false);
    }

    componentDidMount() {

        if (!WEBGL.isWebGLAvailable()) {
            alert('Your browser does not support webgl')
            return
        }

        // document.addEventListener("click", this.handleClick, false);

        this.statsInit();

        this.initiateCamera();

        this.addAsixs();

        // this.addCameraControls();

        const radius = 4;
        const widthSegments = 10;
        const heightSegments = 8;
        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true });


        const sphere1Center = new THREE.Vector3(0, 30, 10)
        const sphere2Center = new THREE.Vector3(-20, 40, 20)


        this.spheres = [
            this.addSphere(geometry, material, sphere1Center),
            this.addSphere(geometry, material, sphere2Center),
            // this.addSphere(geometry, material, 20, 0, 0),
            // this.addSphere(geometry, material, 60, 0, 0),
            // this.addSphere(geometry, material, 100, 0, 0),
        ];

        this.concatTwoVectorsByCylinder(sphere1Center, sphere2Center)

        this.animate();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handlePressAndReplaceCam, false);
    }

    concatTwoVectorsByCylinder = (vstart, vend) => {
        const HALF_PI = Math.PI * .5;
        const distance = vstart.distanceTo(vend);
        const position = vend.clone().add(vstart).divideScalar(2);

        const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
        
        const cylinderRadius=1;
        const numOfSegments=4;

        const cylinder = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, distance, numOfSegments, numOfSegments, false);

        const orientation = new THREE.Matrix4();
        const offsetRotation = new THREE.Matrix4();
        orientation.lookAt(vstart, vend, new THREE.Vector3(0, 1, 0));
        offsetRotation.makeRotationX(HALF_PI);
        orientation.multiply(offsetRotation);
        cylinder.applyMatrix(orientation)

        const mesh = new THREE.Mesh(cylinder, material);
        mesh.position.set(position.x, position.y, position.z);
        this.scene.add(mesh);
    }

    addCylinder = (geometry, material, x, y, z) => {
        const cylinder = new THREE.Mesh(geometry, material);

        cylinder.position.x = x;
        cylinder.position.y = y;
        cylinder.position.z = z;

        // cylinder.rotateZ(THREE.Math.degToRad(90));

        this.scene.add(cylinder);

        return cylinder;
    }

    addSphere = (geometry, material, vector) => {
        const sphere = new THREE.Mesh(geometry, material);
        const { x, y, z } = vector;
        sphere.position.set(x, y, z);
        // sphere.position = vector




        this.scene.add(sphere);


        return sphere;
    }

    addCube = (geometry, color, x) => {
        const material = new THREE.MeshBasicMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        cube.position.x = x;
        return cube;
    }


    animate = () => {
        this.stats1.begin();
        this.stats2.begin();

        if (!this.mount) return
        // const width = this.mount.clientWidth;
        // const height = this.mount.clientHeight;


        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();

        }

        // this.cubes.forEach((cube, ndx) => {
        //     cube.rotation.x += 0.01;
        // });

        this.renderer.render(this.scene, this.camera);

        this.stats1.end();
        this.stats2.end();
        this.frameId = window.requestAnimationFrame(this.animate);

    }

    resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    render() {

        const { width, height } = this.props;

        return (
            <div ref="stats"
            // onMouseMove={this.handleMouseMove}

            // onMouseDown={this.handleMouseDown}
            // onMouseUp={this.handleMouseUp}
            // onClick={this.handleClick}
            >
                <canvas
                    className={styles.boardCanvas}
                    style={{ width, height }}
                    ref={(mount) => {
                        this.mount = mount;
                    }}
                />
            </div>
        );
    }
}


ThreeJsPlayGround = fitDimensions(ThreeJsPlayGround);

export default ThreeJsPlayGround;













































//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const WEBGL = {

    isWebGLAvailable: function () {

        try {

            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

        } catch (e) {

            return false;

        }

    },

    isWebGL2Available: function () {
        try {
            const canvas = document.createElement('canvas');
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

        const names = {
            1: 'WebGL',
            2: 'WebGL 2'
        };

        const contexts = {
            1: window.WebGLRenderingContext,
            2: window.WebGL2RenderingContext
        };

        const message = 'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';

        const element = document.createElement('div');
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