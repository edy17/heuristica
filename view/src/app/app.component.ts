import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'heuristica';
  style;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  controls;
  raycaster;
  mouse;
  plane;
  planeNormal;
  point;
  frameId: number = null;

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  // @HostListener('mousedown', ['$event'])
  // onMousedown(e) {
  //   this.getPoint(e);
  //   this.setPoint();
  // }

  ngOnInit(): void {
    this.canvas = this.rendererCanvas.nativeElement;
    this.initCanvas();
    this.animate();
  }

  public initCanvas(): void {

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60,
      this.canvas.clientWidth / this.canvas.clientHeight, 1, 1000);
    this.camera.position.set(0, 0, 10);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.plane = new THREE.Plane();
    this.planeNormal = new THREE.Vector3();
    this.point = new THREE.Vector3();

    this.canvas.addEventListener("mousedown", ev => this.setPoint(ev), false);
    this.canvas.addEventListener("mousemove", ev => this.setPoint(ev), false);

    document.addEventListener("mousemove", ev => {


    }, false);
  }

  setPoint(event) {
    let rect = event.target.getBoundingClientRect();
    this.mouse.x = ((event.clientX- rect.left) / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY- rect.top) / this.canvas.clientHeight) * 2 + 1;
    console.log(event.clientX- rect.left, event.clientY- rect.top);
    this.planeNormal.copy(this.camera.position).normalize();
    this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.scene.position);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.raycaster.ray.intersectPlane(this.plane, this.point);
    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(.125, 4, 2), new THREE.MeshBasicMaterial({
      color: "yellow",
      wireframe: true
    }));
    sphere.position.copy(this.point);
    this.scene.add(sphere);
  }


  public animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    this.render();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
