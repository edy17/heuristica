import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SpatiumService} from "./spatium.service";
import {Point} from "./model/point.model";
import {Circle} from "./model/circle.model";

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

  randomPointsUUID: string = null;
  convexEnvelope: Array<THREE.Line> = null;
  minimumCircleDiameter: THREE.Line = null;
  minimumCircle: THREE.Line = null;

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

  ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  initCanvas(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(95,
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
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  clearCanvas() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.randomPointsUUID = null;
    this.convexEnvelope = null;
    this.minimumCircleDiameter = null;
    this.minimumCircle = null;
    return false;
  }

  setPoint(input: Point, color, isVisible: boolean): THREE.Mesh {
    let point = new THREE.Vector2();
    point.x = (input.x / this.canvas.clientWidth) * 2 - 1;
    point.y = -(input.y / this.canvas.clientHeight) * 2 + 1;
    this.planeNormal.copy(this.camera.position).normalize();
    this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.scene.position);
    this.raycaster.setFromCamera(point, this.camera);
    this.raycaster.ray.intersectPlane(this.plane, this.point);
    let sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(.100, 0.01, 0.01)
      , new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false
      }));
    sphere.position.copy(this.point);
    sphere.visible = isVisible;
    this.scene.add(sphere);
    return sphere;
  }

  setLine(p: THREE.Mesh, q: THREE.Mesh, color, isVisible: boolean): THREE.Line {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(p.position, q.position);
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: color}));
    line.visible = isVisible;
    this.scene.add(line);
    return line;
  }

  loadRandomPoints() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.spatiumService.getDetailedPoints(this.spatiumService.host + '/points')
      .subscribe(detailedPoints => {
        this.convexEnvelope = null;
        this.minimumCircleDiameter = null;
        this.minimumCircle = null;
        this.randomPointsUUID = null;
        detailedPoints.randomPoints.map(p => (this.setPoint(p, "yellow", true)));
        this.randomPointsUUID = detailedPoints.sessionUUID;
        this.getConvexEnvelope();
        this.getMinimumDomainCircle();
      }), err => {
      console.log(err);
    };
  }

  getConvexEnvelope() {
    if (this.randomPointsUUID) {
      this.spatiumService.getPoints(this.spatiumService.host + '/points/convex/' + this.randomPointsUUID)
        .subscribe(points => {
          let lines = new Array<THREE.Line>();
          let tmp = points.map(p => (this.setPoint(p, "blue", false)));
          tmp.reduce(((p, c) => {
            let line = this.setLine(p, c, "blue", false);
            lines.push(line);
            return c;
          }));
          let first = tmp.shift();
          let last = tmp.pop();
          let line = this.setLine(first, last, "blue", false);
          lines.push(line);
          this.convexEnvelope = lines;
        }), err => {
        console.log(err);
      };
    }
  }

  getMinimumDomainCircle() {
    if (this.randomPointsUUID) {
      this.spatiumService.getCircle(this.spatiumService.host + '/points/circle/' + this.randomPointsUUID)
        .subscribe(circle => {
          this.getMinimumCircle(circle);
          this.getMinimumCircleDiameter(circle);
        }), err => {
        console.log(err);
      };
    }
  }

  getMinimumCircleDiameter(circle: Circle) {
    let p = this.setPoint(circle.diameter.p, "red", false);
    let q = this.setPoint(circle.diameter.q, "red", false);
    let line = this.setLine(p, q, "red", false);
    this.minimumCircleDiameter = line;
    this.scene.add(line);
  }

  getMinimumCircle(circle: Circle) {
    let geometry = new THREE.Geometry();
    let p = this.setPoint(circle.diameter.p, "red", false).position;
    let center = this.setPoint(circle.center, "red", false).position;
    let radius = center.distanceTo(p);
    for (let i = 0; i <= 360; i++) {
      geometry.vertices.push(new THREE.Vector3(center.x + Math.cos(i * (Math.PI / 180)) * radius, center.y + Math.sin(i * (Math.PI / 180)) * radius, 0));
    }
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "red"}));
    line.visible = false;
    this.minimumCircle = line;
    this.scene.add(line);
  }

  generateRandomPoints() {
    this.controls.reset();
    this.loadRandomPoints();
    return false;
  }

  showConvexEnvelope() {
    if (this.convexEnvelope) {
      this.convexEnvelope.forEach(line => {
        line.visible = !line.visible;
      })
    }
    return false;
  }

  showMinimumCircleDiameter() {
    if (this.minimumCircleDiameter) {
      this.minimumCircleDiameter.visible = !this.minimumCircleDiameter.visible;
    }
    return false;
  }

  showMinimumCircle() {
    if (this.minimumCircle) {
      this.minimumCircle.visible = !this.minimumCircle.visible;
    }
    return false;
  }
}
