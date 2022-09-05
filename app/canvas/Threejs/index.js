import * as THREE from 'three'
import gsap from 'gsap'

import vertex from 'shaders/vertex.glsl'
import fragment from 'shaders/fragment.glsl'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default class {
    constructor() {

        this.scroll = 0

        this.threejsCanvas = document.querySelector('.threejs__canvas__container')
        this.width = this.threejsCanvas.offsetWidth
        this.height = this.threejsCanvas.offsetHeight

        this.scene = new THREE.Scene()
        this.camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -10, 10 );
        this.scene.add(this.camera)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        })

        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.threejsCanvas.appendChild(this.renderer.domElement)

        this.loadTextures()

        ScrollTrigger.create({
            trigger: ".threejs",
            start: "top top",
            // snap: true,
            end: "bottom bottom",
            onUpdate: self => this.scroll = self.progress
        })

    }

    loadTextures() {

        const textureLoader = new THREE.TextureLoader()
        const texture1 = textureLoader.load('https://images.unsplash.com/photo-1597626133663-53df9633b799?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2F0fGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60')
        const texture2 = textureLoader.load('https://images.unsplash.com/photo-1570824105192-a7bb72b73141?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGtpdHRlbnxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60')
        
        this.planeGeometry = new THREE.PlaneBufferGeometry(1,1)
        this.planeMaterial = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms:
            {
                uScrollProgress: { value: 0 },
                uTexture1: { value: texture1 },
                uTexture2: { value: texture2 }
            }
        })
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)

         // this will not stretch the image because we already know all out images have aspect ratio of 1
        if(this.width < this.height) {
            this.plane.scale.set(this.height/this.width, 1, 1)
        } else {
            this.plane.scale.set(1, this.width/this.height, 1)
        }
        
        this.scene.add(this.plane)
    }

    onMouseDown() {

    }

    onMouseUp() {

    }

    onMouseMove() {

    }

    update() {
        this.renderer.render(this.scene, this.camera)
        this.planeMaterial.uniforms.uScrollProgress.value = this.scroll
    }


    onResize() {
        this.width = this.threejsCanvas.offsetWidth
        this.height = this.threejsCanvas.offsetHeight

        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()

        if(this.width < this.height) {
            this.plane.scale.set(this.height/this.width, 1, 1)
        } else {
            this.plane.scale.set(1, this.width/this.height, 1)
        }
    }

    /**
     * Destroy.
     */
    destroy() {
        this.destroyThreejs(this.scene)
    }

    destroyThreejs(obj) {
        while (obj.children.length > 0) {
            this.destroyThreejs(obj.children[0]);
            obj.remove(obj.children[0]);
        }
        if (obj.geometry) obj.geometry.dispose();

        if (obj.material) {
            //in case of map, bumpMap, normalMap, envMap ...
            Object.keys(obj.material).forEach(prop => {
                if (!obj.material[prop])
                    return;
                if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
                    obj.material[prop].dispose();
            })
            // obj.material.dispose();
        }
    }
}