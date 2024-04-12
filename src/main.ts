import { DEG2RAD } from 'three/src/math/MathUtils.js'
import './style.css'
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

class App {
  private domApp: Element
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera
  private orbitControls?: OrbitControls;

  constructor() {
    console.log('Hello three.js')

    this.domApp = document.querySelector('#app')!
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.domApp.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()

    this.setupCamera()
    this.setupLight()
    this.setupControls()
    this.setupModels()
    this.setupGUI()
    this.setupEvents()
  }

  private setupControls() {
    this.orbitControls = new OrbitControls(this.camera!, this.domApp as HTMLElement)
  }

  private setupCamera() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight
    
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100)
    this.camera.position.set(0, 2, 5);
  }

  private setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this.scene.add(light)
  }

  private update(time: number) {
    time *= 0.001 // ms -> s    

    this.orbitControls?.update();
  }

  private setupGUI() {
    const gui = new GUI()
        
  }

  private setupModels() {  
    const axisHelper = new THREE.AxesHelper(10)
    this.scene.add(axisHelper)

    // Add Plane
    const geomPlane = new THREE.PlaneGeometry(5, 5)
    const matPlane = new THREE.MeshPhongMaterial()
    const plane = new THREE.Mesh(geomPlane, matPlane)
    plane.name = "plane"
    plane.rotateX(-DEG2RAD*90)
    plane.translateZ(-0.5);
    this.scene.add(plane)

    // Add Big ball
    const geomBigBall = new THREE.SphereGeometry(1, 32, 16, 0, DEG2RAD*360, 0, DEG2RAD*90);
    const matBigBall = new THREE.MeshPhongMaterial();
    const bigBall = new THREE.Mesh(geomBigBall, matBigBall);
    bigBall.name = "bigBall"
    bigBall.translateY(-0.5);
    this.scene.add(bigBall)

    // Add 8 Toruses
    const cntItems = 8;
    const geomTorus = new THREE.TorusGeometry(0.3, 0.1);
    const matTorus = new THREE.MeshPhongMaterial();

    for(let i=0; i<cntItems; i++) {
      const torus = new THREE.Mesh(geomTorus, matTorus)

      const pivotTorus = new THREE.Object3D()
      this.scene.add(pivotTorus)
  
      torus.translateX(2)
      pivotTorus.rotateY(DEG2RAD*360 / cntItems * i)

      pivotTorus.add(torus)
      torus.name = `torus-${i}`
    }

    // Add Small ball
    const geomSmallBall = new THREE.SphereGeometry(0.2);
    const matSmallBall = new THREE.MeshPhongMaterial();
    const smallBall = new THREE.Mesh(geomSmallBall, matSmallBall)
    const pivotSmallBall = new THREE.Object3D()
    
    pivotSmallBall.add(smallBall)
    smallBall.translateX(2)
    smallBall.name = "smallBall"
    this.scene.add(pivotSmallBall);
  }

  private setupEvents() {
    window.onresize = this.resize.bind(this)
    this.resize()
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  private resize() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight

    const camera = this.camera
    if(camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    this.renderer.setSize(width, height)
  }

  private render(time: number) {
    this.update(time)
    this.renderer.render(this.scene, this.camera!)
  }
}

new App()