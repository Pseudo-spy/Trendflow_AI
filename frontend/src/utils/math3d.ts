import * as THREE from 'three';

/**
 * Generates an array of 3D points forming a parabolic arc between two positions
 */
export function createArcPoints(
  start: [number, number, number],
  end: [number, number, number],
  heightOffset: number = 2.0,
  segments: number = 40
): THREE.Vector3[] {
  const vStart = new THREE.Vector3(...start);
  const vEnd = new THREE.Vector3(...end);
  const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
  const distance = vStart.distanceTo(vEnd);
  mid.y += Math.max(heightOffset, distance * 0.28);

  const curve = new THREE.QuadraticBezierCurve3(vStart, mid, vEnd);
  return curve.getPoints(segments);
}

/**
 * Calculates a point on an orbital circle/ellipse around a center point
 */
export function getOrbitPosition(
  center: [number, number, number],
  radiusX: number,
  radiusZ: number,
  angleRad: number,
  tiltAngleX: number = 0.2
): [number, number, number] {
  const x = center[0] + Math.cos(angleRad) * radiusX;
  const z = center[2] + Math.sin(angleRad) * radiusZ;
  const y = center[1] + Math.sin(angleRad) * radiusZ * Math.sin(tiltAngleX);
  return [x, y, z];
}

/**
 * Generates random coordinates inside a spherical shell
 */
export function randomSpherePoint(radius: number = 10, innerRadius: number = 3): [number, number, number] {
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(Math.random()) * (radius - innerRadius) + innerRadius;
  const sinPhi = Math.sin(phi);
  const x = r * sinPhi * Math.cos(theta);
  const y = r * sinPhi * Math.sin(theta);
  const z = r * Math.cos(phi);
  return [x, y, z];
}
