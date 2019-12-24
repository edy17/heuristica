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
  minimumCircle: Circle = null;

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
    this.minimumCircle = null;
    return false;
  }

  setPoint(input: Point, color): THREE.Mesh {
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
    this.scene.add(sphere);
    return sphere;
  }

  loadRandomPoints() {
    this.spatiumService.getDetailedPoints(this.spatiumService.host + '/points')
      .subscribe(detailedPoints => {
        detailedPoints.randomPoints.map(p => (this.setPoint(p, "yellow")));
        this.minimumCircle = null;
        this.randomPointsUUID = detailedPoints.sessionUUID;
        this.getMinimumCircle();
      }), err => {
      console.log(err);
    };
  }

  getMinimumCircle() {
    this.spatiumService.getCircle(this.spatiumService.host + '/points/circle/' + this.randomPointsUUID)
      .subscribe(circle => {
        this.minimumCircle = circle
      }), err => {
      console.log(err);
    };
  }

  generateRandomPoints() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.loadRandomPoints();
    return false;
  }

  drawMinimumConvexEnvelope() {
    if (this.randomPointsUUID) {
      this.spatiumService.getPoints(this.spatiumService.host + '/points/convex/' + this.randomPointsUUID)
        .subscribe(points => {
          let tmp = points.map(p => (this.setPoint(p, "blue")));
          tmp.reduce(((p, c) => {
            let geometry = new THREE.Geometry();
            geometry.vertices.push(p.position, c.position);
            let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "blue"}));
            this.scene.add(line);
            return c;
          }));
          let first = tmp.shift();
          let last = tmp.pop();
          let geometry = new THREE.Geometry();
          geometry.vertices.push(first.position, last.position);
          let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "blue"}));
          this.scene.add(line);
        }), err => {
        console.log(err);
      };
    }
    return false;
  }

  drawMinimumCircleDiameter() {
    if (this.randomPointsUUID && this.minimumCircle) {
      let p = this.setPoint(this.minimumCircle.diameter.p, "red");
      let q = this.setPoint(this.minimumCircle.diameter.q, "red");
      let geometry = new THREE.Geometry();
      geometry.vertices.push(
        p.position,
        q.position
      );
      let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "red"}));
      this.scene.add(line);
    }
    return false;
  }

  drawMinimumCircle() {
    if (this.randomPointsUUID && this.minimumCircle) {
      let geometry = new THREE.Geometry();
      let p = this.setPoint(this.minimumCircle.diameter.p, "red").position;
      let center = this.setPoint(this.minimumCircle.center, "red").position;
      let radius = center.distanceTo(p);
      for (let i = 0; i <= 360; i++) {
        geometry.vertices.push(new THREE.Vector3(center.x + Math.cos(i * (Math.PI / 180)) * radius, center.y + Math.sin(i * (Math.PI / 180)) * radius, 0));
      }
      let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: "red"}));
      this.scene.add(line);
    }
    return false;
  }
}
