import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import * as d3 from 'd3';
// var simulation = d3.forceSimulation(nodes);

import fitDimensions from 'components/helpers/fitDimensions.jsx';


import styles from './ThreeJsPlayGround.scss';


import Stats from 'stats.js';
const OrbitControls = require('three-orbit-controls')(THREE);
const TransformControls = require('three-transform-controls')(THREE);

let INTERSECTED;


class ThreeJsPlayGround extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    initiateCamera = () => {
        this.width = this.mount.clientWidth;
        this.height = this.mount.clientHeight;



        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0A233D);
        const fov = 70;
        const aspect = this.width / this.height;
        const near = 0.1;
        const far = 2000;

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.mount, antialias: false });
        this.renderer.setSize(this.width, this.height);

        // this.camera.position.set(-20, 30, 100);
        this.camera.position.set(0, 0, 100);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        //reset controls btns
        this.controls.mouseButtons = {
            ORBIT: 2,
            ZOOM: 1,
            PAN: 0
        }


        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouse.x = 0;
        this.mouse.y = 0;


        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);







        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // this.control.addEventListener('change', this.render);
        // this.control.addEventListener('dragging-changed', function (event) {
        //     orbit.enabled = !event.value;
        // });




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

        event.preventDefault();

        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;


        this.raycaster.setFromCamera(mouse, this.camera);

        let intersects = this.raycaster.intersectObjects(this.scene.children);


        if (intersects.length != 0) {
            console.log('intersects', intersects[0].object)
        }





        // this.raycaster.setFromCamera(mouse, this.camera);

        // var intersects = this.raycaster.intersectObjects(this.scene.children);
        // if (intersects.length > 0 && intersects[0].object.callback) {
        //     intersects[0].object.callback();
        // }


    }


    handleMouseMove = (event) => {
        event.preventDefault();

        // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    }

    addCameraControls = () => {
        document.addEventListener("keydown", this.handlePressAndReplaceCam, false);
    }

    getNodesWithLinks = () => {
        const masOfNodes = [];

        const numOfNodes = 2;

        for (let i = 0; i < numOfNodes; i++) {
            masOfNodes.push({
                id: i,
                name: 'name' + i,
                links: []
            });
        }

        //add links

        // masOfNodes[0].links = [1, 2, 3, 4, 6];

        // masOfNodes[5].links = [7, 8, 9, 10];
        // masOfNodes[7].links = [6];

        // masOfNodes[0].links = [1];


        for (let i = 0; i < numOfNodes; i++) {
            masOfNodes[i].links.forEach(el => {
                if (!masOfNodes[el].links.includes(i)) {
                    masOfNodes[el].links.push(i)
                }
            });
        }


        for (let i = 0; i < numOfNodes; i++) {
            masOfNodes[i].weight = masOfNodes[i].links.length + 1;
        }

        return masOfNodes

    }


    componentDidMount() {

        if (!WEBGL.isWebGLAvailable()) {
            alert('Your browser does not support webgl')
            return
        }

        this.statsInit();

        this.initiateCamera();

        this.addAsixs();
        // this.addCameraControls();

        this.nodes = this.getNodesWithLinks();


        this.nodes.forEach(el => {
            // Object.defineProperties(el, {
            //     x: {
            //         get: function () {
            //             console.log("getX", this.xx)
            //             return this.xx;
            //         },
            //         set: function (x) {
            //             console.log("setX", x)
            //             // this.xx = x;
            //         }
            //     },
            //     y: {

            //         get: function () {
            //             return this.y;
            //         },

            //         set: function (y) {
            //             console.log("setY", y)
            //         }
            //     }
            // });
        });


        // new THREE.Vector3()

        // Object.defineProperties(position, {
        //     x: {
        //         get: function () {
        //             console.log("getX", this.xx)
        //             return this.xx;
        //         },
        //         set: function (x) {
        //             console.log("setX", x)
        //             // this.xx = x;
        //         }
        //     },
        //     y:{

        //         get: function () {
        //             return this.y;
        //         },

        //         set: function (y) {
        //             console.log("setY", y)
        //         }
        //     }
        // });


        this.links = [
            { "source": 0, "target": 1 },
            // { "source": 0, "target": 2 },
            // { "source": 0, "target": 3 },
            // { "source": 0, "target": 4 },
            // { "source": 5, "target": 6 },
            // { "source": 6, "target": 7 },
        ]


        const simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink(this.links).id(d => d.id))
            .force("collide", d3.forceCollide(17))
            .force("charge", d3.forceManyBody())


        // .force("center", d3.forceCenter());

        //default
        simulation.velocityDecay(0.4);
        // simulation.speedDecay([20]);

        simulation.tick([20])

        // this.controls.enabled = false


        this.startAnimations()


    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handlePressAndReplaceCam, false);
    }

    startAnimations = () => {


        console.log('this.links', _.cloneDeep(this.links))
        console.log('this.nodes', _.cloneDeep(this.nodes))


        const radius = 3;
        const widthSegments = 15;
        const heightSegments = 20;
        // const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);

        const material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true });

        const weightScaleCoef = 0.5;


        this.nodes.forEach(el => {
            // let newGeometry;
            // if (el.weight != 1) {
            //     newGeometry = new THREE.SphereBufferGeometry(radius + el.weight * (weightScaleCoef * radius), widthSegments, heightSegments);
            // }

            const { x, y } = el
            const sphereCenter = new THREE.Vector3(x, y, 0);
            // if (newGeometry) {
            // this.addSphere(newGeometry, material, sphereCenter, el)
            // } else {
            this.addSphere(geometry, material, sphereCenter, el)
            // }
        });

        this.renderLinks(this.links);


        this.animate();
    }

    renderLinks = (links) => {
        links.forEach(el => {
            const vector1 = getVectorFromNodeCoordinates(el.source);
            const vector2 = getVectorFromNodeCoordinates(el.target);
            this.concatTwoVectorsByCylinder(vector1, vector2)
        })

        function getVectorFromNodeCoordinates(node) {
            const { x = vx, y = vy, z = 0 } = node;
            return new THREE.Vector3(x, y, z)
        }
    }

    concatTwoVectorsByCylinder = (vstart, vend) => {
        const HALF_PI = Math.PI * .5;
        const distance = vstart.distanceTo(vend);
        const position = vend.clone().add(vstart).divideScalar(2);

        const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

        const cylinderRadius = 0.5;
        const numOfSegments = 8;

        const cylinder = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, distance, numOfSegments, numOfSegments, false);

        const orientation = new THREE.Matrix4();
        const offsetRotation = new THREE.Matrix4();
        orientation.lookAt(vstart, vend, new THREE.Vector3(0, 1, 0));
        offsetRotation.makeRotationX(HALF_PI);
        orientation.multiply(offsetRotation);
        cylinder.applyMatrix(orientation)

        const link = new THREE.Mesh(cylinder, material);
        console.log('link mesh', link)
        link.position.set(position.x, position.y, position.z);
        this.scene.add(link);
    }

    addCylinder = (geometry, material, x, y, z) => {
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.aType = 'CYLINDER';

        cylinder.position.x = x;
        cylinder.position.y = y;
        cylinder.position.z = z;

        // cylinder.rotateZ(THREE.Math.degToRad(90));

        this.scene.add(cylinder);

        return cylinder;
    }

    movingControl(movedObjControlInstance) {
        const { x, y, z } = movedObjControlInstance.target.position;
        console.log('changeObj', movedObjControlInstance.target.object);
    }

    addSphere = (geometry, material, vector, el) => {
        const control = new TransformControls(this.camera, this.renderer.domElement);
        control.addEventListener('objectChange', this.movingControl)
        control.enabled = false;

        // control.disableAxis('x');

        console.log('income', _.cloneDeep(el))
        const sphere = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 'green' }));

        sphere.aType = 'SPHERE';
        sphere.callback = function () { console.log('CAllBAck'); }
        const { x, y, z } = vector;
        sphere.position.set(x, y, z);
        // sphere.position = vector

        console.log('sphere', sphere)

        this.scene.add(sphere);

        // control.attach(sphere);


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

        if (!this.mount) return;

        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();

        }



        // this.raycaster.setFromCamera(this.mouse, this.camera);

        // let intersects = this.raycaster.intersectObjects(this.scene.children);

        // if (intersects.length > 0) {
        //     console.log('intersects', intersects[0])

        // }



        // this.raycaster.setFromCamera(this.mouse, this.camera);
        // var intersects = this.raycaster.intersectObjects(this.scene.children);
        // if (intersects.length > 0 &&  intersects[0].object.aType) {
        //     console.log('intersects[ 0 ].object', intersects[0].object);
        // }




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
                onClick={this.handleClick}
                // onMouseMove={this.handleMouseMove}
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