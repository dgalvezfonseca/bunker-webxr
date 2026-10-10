import { createSystem, Entity, UIKitMLAsset } from '@iwsdk/core';
import { Experience } from './experience-component.js';

const stations = [
  {
    id: 'station-vehicle',
    title: 'Acceso vehicular',
    body: 'Supervision demostrativa de entradas y salidas de unidades.',
    demo: 'Simular autorizacion vehicular',
    active: 'Autorizacion ficticia en curso. La barrera volvera a cerrar.',
  },
  {
    id: 'station-booth',
    title: 'Caseta de vigilancia',
    body: 'Presencia de personal asignado a la supervision del acceso.',
    demo: 'Mostrar supervision de entrada',
    active: 'Supervision ficticia de una entrada en curso.',
  },
  {
    id: 'station-pedestrian',
    title: 'Acceso peatonal',
    body: 'Verificacion conceptual de identidad antes del ingreso.',
    demo: 'Simular lectura y torniquete',
    active: 'Lectura ficticia aceptada. El torniquete se habilita.',
  },
  {
    id: 'station-reception',
    title: 'Recepcion',
    body: 'Control y registro visual de ingresos dentro de la demostracion.',
    demo: 'Mostrar registro de acceso',
    active: 'Registro visual ficticio de acceso en curso.',
  },
  {
    id: 'station-corridor',
    title: 'Corredor de vigilancia',
    body: 'Rondines en zonas definidas y seguimiento de puntos de revision.',
    demo: 'Ver evento explicativo',
    active: 'Evento ficticio: se senala un acceso no autorizado.',
  },
  {
    id: 'station-monitoring',
    title: 'Centro de monitoreo',
    body: 'La vigilancia puede complementarse con monitoreo y tecnologia segun la instalacion.',
    demo: 'Activar vistas ficticias',
    active: 'Vistas ficticias: acceso principal y zona interior.',
  },
] as const;

export class ExperienceSystem extends createSystem({
  experience: { required: [Experience] },
}) {
  private controller?: Entity;

  init(): void {
    this.controller = this.queries.experience.entities.values().next().value;
    if (this.controller == null) return;

    stations.forEach((station, index) => this.connectStation(station, index));

    const welcome = this.world.getSceneObject<UIKitMLAsset>('welcome-panel');
    const guidedButton = welcome?.getElementById('guided-button');
    if (guidedButton != null) {
      guidedButton.name = 'Start Guided Tour';
      const startGuided = () => {
        this.controller?.setValue(Experience, 'guided', true);
        this.controller?.setValue(Experience, 'tourStep', 1);
        this.controller?.setValue(Experience, 'completed', false);
        this.refreshGuide();
      };
      guidedButton.addEventListener('click', startGuided);
      this.cleanupFuncs.push(() => guidedButton.removeEventListener('click', startGuided));
    }
  }

  private connectStation(station: (typeof stations)[number], index: number): void {
    const panel = this.world.getSceneObject<UIKitMLAsset>(station.id);
    const number = panel?.getElementById('station-number');
    const title = panel?.getElementById('station-title');
    const body = panel?.getElementById('station-body');
    const status = panel?.getElementById('station-status');
    const demoButton = panel?.getElementById('demo-button');
    const demoLabel = panel?.getElementById('demo-label');
    const guideButton = panel?.getElementById('guide-button');
    const guideLabel = panel?.getElementById('guide-label');
    if (number == null || title == null || body == null || status == null || demoButton == null ||
        demoLabel == null || guideButton == null || guideLabel == null) return;

    number.setProperties({ text: `ESTACION ${String(index + 1).padStart(2, '0')}` });
    title.setProperties({ text: station.title });
    body.setProperties({ text: station.body });
    status.setProperties({ text: 'Demostracion opcional disponible.' });
    demoLabel.setProperties({ text: station.demo });
    guideLabel.setProperties({ text: index === stations.length - 1 ? 'Finalizar recorrido' : 'Continuar recorrido' });
    demoButton.name = `Demo ${station.title}`;
    guideButton.name = `Guide ${station.title}`;

    const runDemo = () => {
      this.controller?.setValue(Experience, 'demoElapsed', 0);
      this.controller?.setValue(Experience, 'activeDemo', index + 1);
      status.setProperties({ text: station.active, backgroundColor: '#f5e6bf', color: '#6d5015' });
    };
    const advanceGuide = () => {
      this.controller?.setValue(Experience, 'guided', true);
      if (index === stations.length - 1) {
        this.controller?.setValue(Experience, 'tourStep', 0);
        this.controller?.setValue(Experience, 'completed', true);
        body.setProperties({
          text: 'Resumen: presencia, control de accesos, rondines, seguimiento y apoyo tecnologico segun la instalacion.',
        });
      } else {
        this.controller?.setValue(Experience, 'tourStep', index + 2);
      }
      this.refreshGuide();
    };
    demoButton.addEventListener('click', runDemo);
    guideButton.addEventListener('click', advanceGuide);
    this.cleanupFuncs.push(
      () => demoButton.removeEventListener('click', runDemo),
      () => guideButton.removeEventListener('click', advanceGuide),
    );
  }

  private refreshGuide(): void {
    if (this.controller == null) return;
    const step = this.controller.getValue(Experience, 'tourStep');
    const completed = this.controller.getValue(Experience, 'completed');
    stations.forEach((station, index) => {
      const status = this.world.getSceneObject<UIKitMLAsset>(station.id)?.getElementById('station-status');
      if (status == null) return;
      if (completed && index === stations.length - 1) {
        status.setProperties({ text: 'RECORRIDO COMPLETADO', backgroundColor: '#cfe9db', color: '#225d40' });
      } else if (step === index + 1) {
        status.setProperties({ text: 'SIGUIENTE PARADA SUGERIDA', backgroundColor: '#dceff0', color: '#1f5f64' });
      } else {
        status.setProperties({ text: 'Exploracion libre disponible.', backgroundColor: '#eef1f4', color: '#46515d' });
      }
    });
  }
}
