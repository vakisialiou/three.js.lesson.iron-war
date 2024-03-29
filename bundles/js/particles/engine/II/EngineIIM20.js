import Engine from '../Engine';
import ParticleClassII from "../../../classes/ParticleClassII";

class EngineIIM20 extends Engine {
	constructor() {
		super('EngineIIM20', Engine.II_M20_KEY);
		
		/**
		 *
		 * @type {ParticleClassII}
		 */
		this.particleClass = new ParticleClassII();
	}
}

export default EngineIIM20;