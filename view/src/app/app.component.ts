import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SpatiumService} from "./spatium.service";
import {Point} from "./model/point.model";

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
  plane;
  planeNormal;
  point;
  frameId: number = null;

  randomPoints: Array<THREE.Mesh> = null;

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(public spatiumService: SpatiumService) {
  }

  ngOnInit(): void {
    this.canvas = this.rendererCanvas.nativeElement;
    this.initCanvas();
    this.animate();
    this.loadRandomPoints();
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.canvas = this.rendererCanvas.nativeElement;
  //   this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  //   this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
  //   this.camera.updateProjectionMatrix();
  //   requestAnimationFrame(() => this.animate());
  // }

  public initCanvas(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(100,
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
    this.plane = new THREE.Plane();
    this.planeNormal = new THREE.Vector3();
    this.point = new THREE.Vector3();

    let points = new Array<THREE.Vector3>();

    // 360 full circle will be drawn clockwise
    let geometry = new THREE.Geometry();

    for(let i = 0; i <= 360; i++){
      geometry.vertices.push(new THREE.Vector3(3+Math.cos(i*(Math.PI/180))*10, 3+Math.sin(i*(Math.PI/180))*10, 0));
    }
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "red"}));
    this.scene.add(line);


    // this.canvas.addEventListener("mousedown", ev => this.setPoint(ev), false);
    // this.canvas.addEventListener("mousemove", ev => this.setPoint(ev), false);
  }


  setPoint(input: Point): THREE.Mesh {
    // let rect = event.target.getBoundingClientRect();
    // point.x = ((event.clientX - rect.left) / this.canvas.clientWidth) * 2 - 1;
    // point.y = -((event.clientY - rect.top) / this.canvas.clientHeight) * 2 + 1;
    // console.log(event.clientX - rect.left, event.clientY - rect.top);
    let point = new THREE.Vector2();
    point.x = (input.x / this.canvas.clientWidth) * 2 - 1;
    point.y = -(input.y / this.canvas.clientHeight) * 2 + 1;
    this.planeNormal.copy(this.camera.position).normalize();
    this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.scene.position);
    this.raycaster.setFromCamera(point, this.camera);
    this.raycaster.ray.intersectPlane(this.plane, this.point);
    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(.100, 0.01, 0.01), new THREE.MeshBasicMaterial({
      color: "yellow",
      wireframe: false
    }));
    sphere.position.copy(this.point);
    this.scene.add(sphere);
    return sphere;
  }

  public animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    this.render();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public loadRandomPoints() {
    this.spatiumService.getPoints(this.spatiumService.host + '/points')
      .subscribe(points => {
        points.map(p => (this.setPoint(p))).reduce(((p, c) => {
          let geometry = new THREE.Geometry();
          geometry.vertices.push(
            p.position,
            c.position
          );
          let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "blue"}));
          this.scene.add(line);
          return c;
        }));
      }), err => {
      console.log(err);
    };
    if (this.randomPoints) {
      console.log(this.randomPoints.length);
    }
  }

  generateRandomPoints() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.loadRandomPoints();

    return false;
  }

  clearCanvas() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    return false;
  }

  ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }
}
