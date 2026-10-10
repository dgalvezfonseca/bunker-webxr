import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
} from '@iwsdk/core';

type Vec3 = [number, number, number];

const materials = {
  asphalt: new MeshStandardMaterial({ color: '#1c2430', roughness: 0.95 }),
  concrete: new MeshStandardMaterial({ color: '#69727d', roughness: 0.9 }),
  wall: new MeshStandardMaterial({ color: '#d7dbe0', roughness: 0.82 }),
  steel: new MeshStandardMaterial({ color: '#303a46', metalness: 0.55, roughness: 0.45 }),
  glass: new MeshStandardMaterial({ color: '#57a7b5', metalness: 0.15, roughness: 0.25 }),
  accent: new MeshStandardMaterial({ color: '#d49b26', metalness: 0.1, roughness: 0.62 }),
  route: new MeshStandardMaterial({ color: '#2a8991', roughness: 0.68 }),
  screen: new MeshStandardMaterial({ color: '#13273b', metalness: 0.35, roughness: 0.28 }),
};

function box(parent: Group, name: string, size: Vec3, position: Vec3, material: MeshStandardMaterial): Mesh {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent: Group, name: string, radius: number, height: number, position: Vec3): Mesh {
  const mesh = new Mesh(new CylinderGeometry(radius, radius, height, 12), materials.steel);
  mesh.name = name;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function buildFacility(): Group {
  const root = new Group();
  root.name = 'BunkerDemoFacilityBase';

  box(root, 'SiteSlab', [18, 0.12, 20], [0, -0.06, -7], materials.concrete);
  box(root, 'VehicleLane', [7, 0.03, 19], [-1.8, 0.02, -7], materials.asphalt);
  box(root, 'PedestrianWalkway', [3, 0.04, 19], [4.8, 0.03, -7], materials.wall);

  cylinder(root, 'PedGateLeft', 0.11, 2.35, [3.4, 1.18, -2.1]);
  cylinder(root, 'PedGateRight', 0.11, 2.35, [5.7, 1.18, -2.1]);
  box(root, 'PedGateHeader', [2.5, 0.18, 0.25], [4.55, 2.3, -2.1], materials.steel);
  box(root, 'EntranceSignMount', [2.8, 1.0, 0.12], [4.55, 1.15, -2.25], materials.screen);

  box(root, 'CheckpointDesk', [3.2, 0.95, 0.9], [0.2, 0.48, -5.7], materials.steel);
  box(root, 'CheckpointMonitor', [1.05, 0.65, 0.1], [0.2, 1.45, -6.12], materials.screen);
  box(root, 'IdentityReader', [0.24, 0.16, 0.34], [1.25, 1.04, -5.55], materials.accent);
  cylinder(root, 'TurnstilePost', 0.18, 1.05, [3.3, 0.53, -5.8]);
  box(root, 'TurnstileArmA', [1.55, 0.06, 0.06], [3.3, 0.92, -5.8], materials.steel);
  const turnstileB = box(root, 'TurnstileArmB', [1.55, 0.06, 0.06], [3.3, 0.92, -5.8], materials.steel);
  turnstileB.rotation.y = Math.PI / 2;

  box(root, 'InteriorFloor', [12, 0.08, 10], [0, 0.02, -11.7], materials.wall);
  box(root, 'InteriorLeftWall', [0.2, 3.2, 10], [-6, 1.6, -11.7], materials.wall);
  box(root, 'InteriorRightWall', [0.2, 3.2, 10], [6, 1.6, -11.7], materials.wall);
  box(root, 'InteriorBackWall', [12.2, 3.2, 0.2], [0, 1.6, -16.7], materials.wall);
  box(root, 'InteriorFrontLeft', [4.2, 3.2, 0.2], [-3.9, 1.6, -6.7], materials.wall);
  box(root, 'InteriorFrontRight', [4.2, 3.2, 0.2], [3.9, 1.6, -6.7], materials.wall);
  box(root, 'OfficePartitionLeft', [3.8, 2.5, 0.16], [-4.0, 1.25, -10.3], materials.wall);
  box(root, 'OfficePartitionRight', [3.8, 2.5, 0.16], [4.0, 1.25, -10.3], materials.wall);
  box(root, 'ControlledDoorLeft', [1.45, 2.35, 0.12], [-3.8, 1.18, -10.2], materials.steel);
  box(root, 'ControlledDoorRight', [1.45, 2.35, 0.12], [3.8, 1.18, -10.2], materials.steel);

  const routePoints: Vec3[] = [
    [0, 0.08, -7.6], [0, 0.08, -8.7], [0, 0.08, -9.8], [0, 0.08, -10.9],
    [0, 0.08, -12], [0, 0.08, -13.1], [1.1, 0.08, -14.2], [2.2, 0.08, -14.2],
    [3.3, 0.08, -14.2], [4.4, 0.08, -14.2],
  ];
  routePoints.forEach((position, index) => box(root, `PatrolRoute${index + 1}`, [0.7, 0.025, 0.22], position, materials.route));
  [[0, -8.8], [0, -12.1], [4.4, -14.2]].forEach(([x, z], index) => {
    cylinder(root, `ReviewPoint${index + 1}`, 0.13, 1.1, [x, 0.55, z]);
    box(root, `ReviewPointCap${index + 1}`, [0.45, 0.12, 0.45], [x, 1.12, z], materials.accent);
  });

  box(root, 'SupervisionDesk', [3.6, 0.9, 1.0], [4.0, 0.47, -15.2], materials.steel);
  box(root, 'SupervisionScreenA', [1.3, 0.75, 0.1], [3.25, 1.65, -16.52], materials.screen);
  box(root, 'SupervisionScreenB', [1.3, 0.75, 0.1], [4.75, 1.65, -16.52], materials.screen);
  box(root, 'CameraMountA', [0.12, 0.45, 0.12], [-5.75, 2.75, -8.2], materials.steel);
  box(root, 'CameraA', [0.5, 0.24, 0.28], [-5.45, 2.58, -8.2], materials.screen);
  box(root, 'CameraMountB', [0.12, 0.45, 0.12], [5.75, 2.75, -13.0], materials.steel);
  box(root, 'CameraB', [0.5, 0.24, 0.28], [5.45, 2.58, -13.0], materials.screen);

  return root;
}

const badgeRoot = new Group();
badgeRoot.name = 'AccessBadge';
box(badgeRoot, 'AccessBadgeCard', [0.34, 0.02, 0.22], [0, 0, 0], materials.accent);

export const facilityBase = buildFacility();
export const accessBadge = badgeRoot;
