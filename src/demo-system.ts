import { createSystem, Entity, Mesh, MeshStandardMaterial, UIKitMLAsset } from '@iwsdk/core';
import { Experience } from './experience-component.js';

const stationIds = [
  'station-vehicle',
  'station-booth',
  'station-pedestrian',
  'station-reception',
  'station-corridor',
  'station-monitoring',
] as const;

export class DemoSystem extends createSystem({
  experience: { required: [Experience] },
}) {
  private controller?: Entity;
  private barrier?: Mesh;
  private armA?: Mesh;
  private armB?: Mesh;
  private readerMaterial?: MeshStandardMaterial;
  private boothMonitor?: MeshStandardMaterial;
  private checkpointMonitor?: MeshStandardMaterial;
  private screenA?: MeshStandardMaterial;
  private screenB?: MeshStandardMaterial;
  private cameraA?: MeshStandardMaterial;
  private cameraB?: MeshStandardMaterial;
  private barrierStart = 0;
  private armAStart = 0;
  private armBStart = 0;
  private activeDemo = 0;
  private startedAt = 0;

  init(): void {
    this.controller = this.queries.experience.entities.values().next().value;
    const facility = this.world.getSceneObject('facility-base');
    const guardAccess = this.world.getSceneObject('guard-access');
    if (this.controller == null || facility == null || guardAccess == null) return;

    this.barrier = guardAccess.getObjectByName('VehicleBarrier') as Mesh | undefined;
    this.armA = facility.getObjectByName('TurnstileArmA') as Mesh | undefined;
    this.armB = facility.getObjectByName('TurnstileArmB') as Mesh | undefined;
    this.readerMaterial = this.cloneMaterial(facility.getObjectByName('IdentityReader'));
    this.boothMonitor = this.cloneMaterial(facility.getObjectByName('BoothMonitor'));
    this.checkpointMonitor = this.cloneMaterial(facility.getObjectByName('CheckpointMonitor'));
    this.screenA = this.cloneMaterial(facility.getObjectByName('SupervisionScreenA'));
    this.screenB = this.cloneMaterial(facility.getObjectByName('SupervisionScreenB'));
    this.cameraA = this.cloneMaterial(facility.getObjectByName('CameraA'));
    this.cameraB = this.cloneMaterial(facility.getObjectByName('CameraB'));
    if (this.barrier != null) this.barrierStart = this.barrier.rotation.z;
    if (this.armA != null) this.armAStart = this.armA.rotation.y;
    if (this.armB != null) this.armBStart = this.armB.rotation.y;
    this.setEmissive(this.screenA, '#14636b', 0.65);
    this.setEmissive(this.screenB, '#1b4f78', 0.65);
    this.cleanupFuncs.push(() => this.resetVisuals());
  }

  update(): void {
    if (this.controller == null) return;
    const requested = this.controller.getValue(Experience, 'activeDemo') ?? 0;
    const elapsedState = this.controller.getValue(Experience, 'demoElapsed') ?? 0;
    if (requested !== this.activeDemo || (requested !== 0 && elapsedState === 0)) {
      this.resetVisuals();
      this.activeDemo = requested;
      this.startedAt = performance.now();
    }
    if (this.activeDemo === 0) return;

    const elapsed = (performance.now() - this.startedAt) / 1000;
    this.controller.setValue(Experience, 'demoElapsed', elapsed);
    if (this.animate(this.activeDemo, elapsed)) this.finish();
  }

  private animate(demo: number, elapsed: number): boolean {
    const pulse = 0.7 + Math.sin(elapsed * 5) * 0.35;
    if (demo === 1 && this.barrier != null) {
      const progress = Math.min(elapsed, 1);
      const closeProgress = Math.min(Math.max(elapsed - 4, 0), 1);
      this.barrier.rotation.z = this.barrierStart + 1.25 * progress - 1.25 * closeProgress;
      return elapsed >= 5;
    }
    if (demo === 2) {
      this.setEmissive(this.boothMonitor, '#29a9b2', pulse);
      return elapsed >= 3;
    }
    if (demo === 3) {
      const progress = Math.min(elapsed / 1.5, 1);
      this.setEmissive(this.readerMaterial, '#48c57b', pulse);
      if (this.armA != null) this.armA.rotation.y = this.armAStart + progress * Math.PI * 0.7;
      if (this.armB != null) this.armB.rotation.y = this.armBStart + progress * Math.PI * 0.7;
      return elapsed >= 3;
    }
    if (demo === 4) {
      this.setEmissive(this.checkpointMonitor, '#29a9b2', pulse);
      return elapsed >= 3;
    }
    if (demo === 5) {
      this.setEmissive(this.cameraA, '#d68b24', pulse);
      this.setEmissive(this.cameraB, '#d68b24', pulse);
      return elapsed >= 4;
    }
    this.setEmissive(this.screenA, '#20a3a9', pulse);
    this.setEmissive(this.screenB, '#307fc2', 1.4 - pulse * 0.5);
    return elapsed >= 4;
  }

  private finish(): void {
    const completedDemo = this.activeDemo;
    this.resetVisuals();
    this.activeDemo = 0;
    this.controller?.setValue(Experience, 'activeDemo', 0);
    this.controller?.setValue(Experience, 'demoElapsed', 0);
    const status = this.world.getSceneObject<UIKitMLAsset>(stationIds[completedDemo - 1])
      ?.getElementById('station-status');
    status?.setProperties({
      text: 'Demostracion terminada. Disponible para repetir.',
      backgroundColor: '#cfe9db',
      color: '#225d40',
    });
  }

  private resetVisuals(): void {
    if (this.barrier != null) this.barrier.rotation.z = this.barrierStart;
    if (this.armA != null) this.armA.rotation.y = this.armAStart;
    if (this.armB != null) this.armB.rotation.y = this.armBStart;
    this.setEmissive(this.readerMaterial, '#000000', 0);
    this.setEmissive(this.boothMonitor, '#000000', 0);
    this.setEmissive(this.checkpointMonitor, '#000000', 0);
    this.setEmissive(this.cameraA, '#000000', 0);
    this.setEmissive(this.cameraB, '#000000', 0);
    this.setEmissive(this.screenA, '#14636b', 0.65);
    this.setEmissive(this.screenB, '#1b4f78', 0.65);
  }

  private cloneMaterial(object: unknown): MeshStandardMaterial | undefined {
    if (!(object instanceof Mesh) || !(object.material instanceof MeshStandardMaterial)) return undefined;
    object.material = object.material.clone();
    return object.material;
  }

  private setEmissive(material: MeshStandardMaterial | undefined, color: string, intensity: number): void {
    material?.emissive.set(color);
    if (material != null) material.emissiveIntensity = intensity;
  }
}
