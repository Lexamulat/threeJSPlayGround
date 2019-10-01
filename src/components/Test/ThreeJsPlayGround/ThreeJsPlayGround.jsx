import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import * as d3 from 'd3';

import fitDimensions from 'components/helpers/fitDimensions.jsx';


import styles from './ThreeJsPlayGround.scss';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Stats from 'stats.js';
import { clearInterval } from 'timers';
const OrbitControls = require('three-orbit-controls')(THREE);
const TransformControls = require('three-transform-controls')(THREE);

let MESH_TEMPLATE = undefined;

const IS_SPHERES_VISIBLE = true;

const ANTIALIAS = false;

const TEXT_COLOR = 0x99A6BE;

let LOADED_FONT = undefined;

let CLICK_TIMER = undefined;
const CLEAR_CLICK_TIMER = 200;
let IS_RIGHT_MOUSE_CLICKED = false;


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
        // this.scene.background = new THREE.Color('#edeef0');

        const fov = 70;
        const aspect = this.width / this.height;
        const near = 0.1;
        const far = 2000;

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.mount, antialias: ANTIALIAS });
        this.renderer.setSize(this.width, this.height);

        this.camera.position.set(0, 0, 100);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.mouseButtons = {
            ORBIT: 2,
            ZOOM: 1,
            PAN: 0
        }
        // this.controls = new THREE.TrackballControls(this.camera);
        // this.controls.rotateSpeed = 1.0;
        // this.controls.zoomSpeed = 1.2;
        // this.controls.panSpeed = 0.8;
        // this.controls.noZoom = false;
        // this.controls.noPan = false;
        // this.controls.staticMoving = true;
        // this.controls.dynamicDampingFactor = 0.3;


        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouse.x = 0;
        this.mouse.y = 0;

        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.AmbientLight(color, intensity);

        // const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);

        this.control = new TransformControls(this.camera, this.renderer.domElement);
        this.control.addEventListener('objectChange', this.movingControl)


        this.scene.add(this.control);


        this.loader = new GLTFLoader();

        this.loader.load('/models/serv2/scene.gltf', (gltf) => {
            var mesh = gltf.scene.children[0];

            MESH_TEMPLATE = mesh.clone();

        }, undefined, function (error) {
            console.error(error);
        });


        var fontLoader = new THREE.FontLoader();

        fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {

            LOADED_FONT = font

        });

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

    handleMouseDown = (event) => {
        //handle right mouse btn
        if (event.button != 2) return;

        IS_RIGHT_MOUSE_CLICKED = true;

        CLICK_TIMER = setTimeout(() => {
            IS_RIGHT_MOUSE_CLICKED = false
        }, CLEAR_CLICK_TIMER)

    }
    handleMouseUp = (event) => {
        //handle right mouse btn
        if (event.button != 2) return;

        if (IS_RIGHT_MOUSE_CLICKED) {
            const mouse = this.getMouseCoordinatesFromEvent(event)
            const currentMesh = this.getCurrenRayCastObj(mouse);
            if (currentMesh.aNode) {
                const { x, y, z } = currentMesh.position;
                this.controls.target.set(x, y, z);
            }
        }
    }

    handleDoubleClick = (event) => {
        event.preventDefault();

        const mouse = this.getMouseCoordinatesFromEvent(event)
        const currentMesh = this.getCurrenRayCastObj(mouse)
        currentMesh.doubleClickAddControl()

    }

    getCurrenRayCastObj(mouse) {
        this.raycaster.setFromCamera(mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length != 0) {
            return intersects[0].object
        }
    }

    getMouseCoordinatesFromEvent() {

        let mouse = new THREE.Vector2();
        const { width, height } = this.props;
        const xDelta = (window.innerWidth - width) / 2;
        const yDelta = (window.innerHeight - height) / 2;


        let x = event.clientX - xDelta;
        let y = event.clientY - yDelta;


        mouse.x = (x / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (y / this.renderer.domElement.clientHeight) * 2 + 1;
        return mouse
    }

    getNodesWithLinks = () => {
        const masOfNodes = [];

        const numOfNodes = 3;

        for (let i = 0; i < numOfNodes; i++) {
            masOfNodes.push({
                id: i,
                name: 'name' + i,
                links: []
            });
        }


        masOfNodes[0].links = [0, 1];
        masOfNodes[1].links = [0];
        masOfNodes[2].links = [1];


        // for (let i = 0; i < numOfNodes; i++) {
        //     masOfNodes[i].links.forEach(el => {
        //         if (!masOfNodes[el].links.includes(i)) {
        //             masOfNodes[el].links.push(i)
        //         }
        //     });
        // }


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

        this.nodes = this.getNodesWithLinks();


        this.links = [
            { id: 0, "source": 0, "target": 1, text: 'link 0' },
            { id: 1, "source": 0, "target": 2, text: 'link 1' },
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
        simulation.velocityDecay(0.6);

        simulation.tick([1]);
        simulation.on('end', () => {
            this.startAnimations();
        });

        // this.startAnimations();

    }
    componentWillUnmount() {
        if (CLICK_TIMER) {
            clearInterval(CLICK_TIMER)
        }
    }

    startAnimations = () => {

        const radius = 3;
        const widthSegments = 15;
        const heightSegments = 20;
        // const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);

        const material = new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0 });
        material.transparent = !IS_SPHERES_VISIBLE

        for (let i = 0; i < this.nodes.length; i++) {
            const { x, y } = this.nodes[i]
            const sphereCenter = new THREE.Vector3(x, y, 0);
            const elCopy = cloneDeep(this.nodes[i]);
            this.nodes[i] = this.addSphere(geometry, material, sphereCenter, this.nodes[i], radius);
            this.nodes[i].aNode = elCopy
        }

        this.renderLinks();

        this.animate();
    }

    renderLinks = () => {

        for (let i = 0; i < this.links.length; i++) {
            const vector1 = getVectorFromNodeCoordinates(this.links[i].source);
            const vector2 = getVectorFromNodeCoordinates(this.links[i].target);

            const link = this.concatTwoVectorsByCylinder(vector1, vector2);

            const textMesh = addLinktext(link.position, this.links[i].text)

            //xInitialShift yInitialShift zInitialShift
            const { shiftX, shiftY, shiftZ } = this.getCenteredTextShiftsCoordinates(textMesh, undefined, undefined, 1);
            textMesh.position.set(link.position.x + shiftX, link.position.y + shiftY, link.position.z + shiftZ);
            textMesh.shiftX = shiftX;
            textMesh.shiftY = shiftY;
            textMesh.shiftZ = shiftZ;

            this.scene.add(textMesh)
            this.scene.add(link);

            const { source, target, id } = this.links[i]

            this.links[i] = link;
            this.links[i].sourceNode = source;
            this.links[i].tagretNode = target;
            this.links[i].linkId = id;
            this.links[i].textInstance = textMesh;


        }

        function getVectorFromNodeCoordinates(node) {
            const { x = vx, y = vy, z = 0 } = node;
            return new THREE.Vector3(x, y, z)
        }

        function addLinktext(position, text) {

            const textGeometry = new THREE.TextGeometry(text, {
                font: LOADED_FONT,
                size: 1,
                height: 0.1,
                curveSegments: 1,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                bevelOffset: 0,
                bevelSegments: 1
            });
            const textMaterial = new THREE.MeshPhongMaterial(
                { color: TEXT_COLOR }
            );

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(position.x, position.y, position.z);


            return textMesh
        }
    }

    reDrawNodeLinks = (links, replacedNodeId, replacedNodeVector) => {

        this.links.forEach((globalLinksEl, i) => {

            if (links.includes(globalLinksEl.linkId)) {
                const vector1 = globalLinksEl.sourceNode.id == replacedNodeId ? replacedNodeVector
                    : this.getNodeMeshById(globalLinksEl.sourceNode.id).position;

                const vector2 = globalLinksEl.tagretNode.id == replacedNodeId ? replacedNodeVector
                    : this.getNodeMeshById(globalLinksEl.tagretNode.id).position;


                const link = this.concatTwoVectorsByCylinder(vector1, vector2);

                const { x, y, z } = link.position
                this.updateTextMeshPosition(globalLinksEl.textInstance, x, y, z);

                this.scene.add(link);



                this.scene.add(link);

                this.links[i] = link;
                this.links[i].sourceNode = globalLinksEl.sourceNode;
                this.links[i].tagretNode = globalLinksEl.tagretNode;
                this.links[i].linkId = globalLinksEl.linkId;
                this.links[i].textInstance = globalLinksEl.textInstance;

                this.removeMeshAndGeometryAndMaterial(globalLinksEl)
            }

        });
    }

    removeMeshAndGeometryAndMaterial = (meshObj) => {
        meshObj.geometry.dispose();
        meshObj.material.dispose();
        this.scene.remove(meshObj);
    }

    getNodeMeshById = (id) => {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].aNode.id == id) {
                return this.nodes[i]
            }
        }
    }

    concatTwoVectorsByCylinder = (vstart, vend) => {

        const HALF_PI = Math.PI * .5;
        const distance = vstart.distanceTo(vend);
        const position = vend.clone().add(vstart).divideScalar(2);

        const material = new THREE.MeshBasicMaterial({ color: 'grey', wireframe: false });

        const cylinderRadius = 0.3;
        const numOfSegments = 8;

        let cylinder = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, distance, numOfSegments, numOfSegments, false);

        const orientation = new THREE.Matrix4();
        const offsetRotation = new THREE.Matrix4();
        orientation.lookAt(vstart, vend, new THREE.Vector3(0, 1, 0));
        offsetRotation.makeRotationX(HALF_PI);
        orientation.multiply(offsetRotation);
        cylinder.applyMatrix(orientation)

        const link = new THREE.Mesh(cylinder, material);

        link.position.set(position.x, position.y, position.z);



        return link

    }

    addCylinder = (geometry, material, x, y, z) => {
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.x = x;
        cylinder.position.y = y;
        cylinder.position.z = z;

        this.scene.add(cylinder);

        return cylinder;
    }

    movingControl = (movedObjControlInstance) => {
        const { x, y, z } = movedObjControlInstance.target.position;

        //move model
        movedObjControlInstance.target.object.modelInstance.position.set(x, y, z);

        //move node text
        const textMesh = movedObjControlInstance.target.object.textInstance;

        this.updateTextMeshPosition(textMesh, x, y, z);

        const replacedNode = movedObjControlInstance.target.object.aNode
        const links = replacedNode.links;
        if (links && links.length > 0) {
            this.reDrawNodeLinks(links, movedObjControlInstance.target.object.aNode.id, movedObjControlInstance.target.position)
        }

    }

    updateTextMeshPosition(textMesh, x, y, z) {
        const shiftX = textMesh.shiftX;
        const shiftY = textMesh.shiftY;
        const shiftZ = textMesh.shiftZ;
        textMesh.position.set(x + shiftX, y + shiftY, z + shiftZ);
    }

    addControl = (sphere, control) => () => {
        if (control.object && control.object.uuid == sphere.uuid) {
            control.detach(sphere);
        } else {
            control.attach(sphere);

        }
    }

    addSphere = (geometry, material, vector, el, radius) => {
        const { x, y, z } = vector;

        const sphere = new THREE.Mesh(geometry, material);

        const textGeometry = new THREE.TextGeometry(el.name, {
            font: LOADED_FONT,
            size: 1,
            height: 0.1,
            curveSegments: 1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        });
        const textMaterial = new THREE.MeshPhongMaterial(
            { color: TEXT_COLOR }
        );
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(x, y, z);
        const { shiftX, shiftY, shiftZ } = this.getCenteredTextShiftsCoordinates(textMesh, undefined, -1 * (radius + 2), undefined);

        textMesh.position.set(x + shiftX, y + shiftY, z + shiftZ);

        textMesh.shiftX = shiftX;
        textMesh.shiftY = shiftY;
        textMesh.shiftZ = shiftZ;


        const sphereModel = MESH_TEMPLATE.clone();

        const scaledUnit = 0.04
        sphereModel.scale.set(scaledUnit, scaledUnit, scaledUnit);
        sphereModel.ATYPE = 'SPHERE CUTOM MESH'

        sphere.doubleClickAddControl = this.addControl(sphere, this.control)

        sphere.position.set(x, y, z);
        sphere.modelInstance = sphereModel;
        sphere.textInstance = textMesh;

        sphereModel.position.set(x, y, z);

        this.scene.add(sphere);
        this.scene.add(textMesh);
        this.scene.add(sphereModel);

        return sphere;


    }

    getCenteredTextShiftsCoordinates(textMesh, xInitialShift = 0, yInitialShift = 0, zInitialShift = 0) {
        let shiftX = xInitialShift;
        let shiftY = yInitialShift;
        let shiftZ = zInitialShift;
        const box = new THREE.Box3().setFromObject(textMesh);
        shiftX = -1 * (box.max.x - box.min.x) / 2

        return { shiftX, shiftY, shiftZ }

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


        this.controls.update();
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
                onDoubleClick={this.handleDoubleClick}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}

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