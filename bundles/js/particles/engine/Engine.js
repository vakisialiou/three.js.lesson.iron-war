import Particle from './../../Particle';
import ParticleClassI from "../../classes/ParticleClassI";

class Engine extends Particle {
	/**
	 *
	 * @param {string} type
	 * @param {(string|number)} key
	 */
    constructor(type, key) {
        super(type, key);
		
        
		/**
		 *
		 * @type {ParticleClassI}
		 */
		this.particleClass = new ParticleClassI();
		
		/**
         *
		 * @type {number}
		 */
		this.speedMinX = 0;
		
		/**
         *
		 * @type {number}
		 */
        this.speedMaxX = 0;
        
        /**
         *
		 * @type {number}
		 */
		this.speedMinY = 0;
		
		/**
         *
		 * @type {number}
		 */
        this.speedMaxY = 0;
		
		/**
		 *
		 * @type {number}
		 */
		this.speedMinZ = 0;
		
		/**
		 *
		 * @type {number}
		 */
		this.speedMaxZ = 0;
		
		/**
		 * Left or right moving speed
         *
		 * @type {number}
		 */
		this.speedX = 0;
		
		/**
		 * Up or Down moving speed
		 *
		 * @type {number}
		 */
		this.speedY = 0;
		
		/**
		 * Direct moving speed
         *
		 * @type {number}
		 */
		this.speedZ = 0;
		
		/**
		 * Speed rotate to X or Y
		 *
		 * @type {number}
		 */
		this.rollSpeedXY = 0;
		
		/**
		 * Speed rotation around axis Z
		 *
		 * @type {number}
		 */
		this.rollSpeedZ = 0;
		
		/**
		 *
		 * @type {number}
		 */
		this.accelerationForward = 0;
		
		/**
		 *
		 * @type {number}
		 */
		this.accelerationBack = 0;
		
		/**
		 *
		 * @type {number}
		 */
		this.deceleration = 0;
    }
	
	/**
	 *
	 * @return {{sx: number, sy: number, sz: number, rxy: number, rz: number}}
	 */
	getSocketInfo() {
	    return {
		    sx: this.speedX,
		    sy: this.speedY,
		    sz: this.speedZ,
		    rxy: this.rollSpeedXY,
		    rz: this.rollSpeedZ
	    }
    }
	
	/**
	 *
	 * @param {{sx: number, sy: number, sz: number, rxy: number, rz: number}} data
	 * @return {Engine}
	 */
	setSocketInfo(data) {
	    this.speedX = data['sx'];
	    this.speedY = data['sy'];
	    this.speedZ = data['sz'];
	    this.rollSpeedZ = data['rz'];
	    this.rollSpeedXY = data['rxy'];
	    return this;
    }
	
	/**
	 *
	 * @param {string} direction
	 * @param {number} delta
	 * @returns {Engine}
	 */
	start(direction, delta) {
		let v;
        switch (direction) {
	        case Engine.DIRECTION_FORWARD:
	        	v = delta * this.accelerationForward;
	        	if (this.speedZ + v < this.speedMaxZ) {
			        this.speedZ += v;
		        } else {
	        		this.speedZ = this.speedMaxZ;
		        }
	        	break;
	        case Engine.DIRECTION_BACK:
	        	v = delta * ((this.speedZ > 0) ? this.deceleration : this.accelerationBack);
	        	if (this.speedZ - v > this.speedMinZ) {
	        		this.speedZ -= v;
		        } else {
	        		this.speedZ = this.speedMinZ;
		        }
		        break;
        }
	    return this;
    }
	
	/**
	 *
	 * @param {number} delta
	 * @returns {Engine}
	 */
	stop(delta) {
    	let v = Math.round(delta * this.deceleration);
    	if (this.speedZ > 0) {
    		if (this.speedZ - v > 0) {
			    this.speedZ -= v;
		    } else {
			    this.speedZ = 0;
		    }
    	} else if (this.speedZ < 0) {
    		if (this.speedZ + v < 0) {
			    this.speedZ += v;
		    } else {
			    this.speedZ = 0;
		    }
	    }
	    return this;
    }
	
	/**
	 *
	 * @returns {string}
	 */
    static get DIRECTION_FORWARD() {
    	return 'DIRECTION_FORWARD';
    }
	
	/**
	 *
	 * @returns {string}
	 */
	static get DIRECTION_BACK() {
		return 'DIRECTION_BACK';
	}
	
	/**
     *
	 * @returns {string}
	 */
	static get I_M20_KEY() {
        return 'I_M20_KEY';
    }
	
	/**
     *
	 * @returns {string}
	 */
	static get II_M20_KEY() {
		return 'II_M20_KEY';
	}
	
	/**
     *
	 * @returns {string}
	 */
	static get III_M20_KEY() {
		return 'III_M20_KEY';
	}
	
	/**
     *
	 * @returns {string}
	 */
	static get I_M50_KEY() {
        return 'I_M50_KEY';
    }
	
	/**
     *
	 * @returns {string}
	 */
	static get II_M50_KEY() {
		return 'II_M50_KEY';
	}
	
	/**
     *
	 * @returns {string}
	 */
	static get III_M50_KEY() {
		return 'III_M50_KEY';
	}
	
	/**
     *
	 * @returns {string}
	 */
	static get I_M100_KEY() {
		return 'I_M100_KEY';
	}
	
	/**
     *
	 * @returns {string}
	 */
	static get II_M100_KEY() {
		return 'II_M100_KEY';
	}
	
	/**
     *
	 * @returns {string}
	 */
	static get III_M100_KEY() {
		return 'III_M100_KEY';
	}
}

export default Engine;