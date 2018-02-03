import {THREE, Stats} from '../../api';
import SceneControlsPlugin from './SceneControlsPlugin';
import FlyControls from './FlyControls';
import SkyeBoxControls from './SkyeBoxControls';
import Player from './../player/Player';

import KeyboardControls from "../keyboard/KeyboardControls";
import TargetControls from './TargetControls';
import Particle from './../Particle';

import HelperPoints from './../helpers/HelperPoints';

const FPS = 1000 / 30;

class SceneControls extends SceneControlsPlugin {
	/**
	 *
	 * @param {string|number} playerId - Socket ID
	 * @param {string} [containerID]
	 */
	constructor(playerId, containerID) {
		super();
		/**
		 *
		 * @type {?Element}
		 */
		this.container = document.getElementById(containerID);
		
		if (!this.container) {
			throw new Error('Cannot find container with ID: ' + containerID);
		}
		
		/**
		 *
		 * @type {Clock}
		 * @private
		 */
		this._clockRender = new THREE.Clock();
		
		/**
		 *
		 * @type {Clock}
		 * @private
		 */
		this._clockAnimate = new THREE.Clock();
		
		/**
		 *
		 * @type {SkyeBoxControls}
		 */
		this.skyBoxControls = new SkyeBoxControls(this.scene);
		
		/**
		 *
		 * @type {Player}
		 */
		this.player = new Player(this, true, playerId);
		this.camera.position.copy(this.player.position);
		this.camera.rotation.copy(this.player.rotation);
		this.camera.lookAt(this.player.lookAt);
		
		/**
		 *
		 * @type {?FlyControls}
		 */
		this.flyControls = new FlyControls(this.camera, this.player);
		this.flyControls.initEvents();
		
		/**
		 *
		 * @type {Object.<Player>}
		 * @private
		 */
		this._players = {};
		
		/**
		 *
		 * @type {Array.<Particle>}
		 * @private
		 */
		this._objects = [];
		
		/**
		 *
		 * @type {Array.<updatePlayerListener>}
		 * @private
		 */
		this._updateListener = [];

		/**
		 *
		 * @type {Array.<shotPlayerListener>}
		 * @private
		 */
		this._shotListener = [];

		/**
		 *
		 * @type {Array.<collisionPlayerListener>}
		 * @private
		 */
		this._collisionListener = [];
		
		/**
		 *
		 * @type {TargetControls}
		 */
		this.targetControls = new TargetControls(this);
		
		// this.point = HelperPoints.get()
		// 	.setPointTo(this.scene)
		// 	.setPosition(
		// 		new THREE.Vector3(
		// 			this.camera.position.x,
		// 			this.camera.position.y,
		// 			this.camera.position.z - 50
		// 		)
		// 	);
        // this.point = HelperPoints.get().setPointTo(this.scene);





        this._stats = new Stats();
        this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this._stats.showPanel(1);
        this._stats.showPanel(2);
        document.body.appendChild(this._stats.dom);

	}

    /**
	 *
     * @returns {Array.<Particle>}
     */
	getObjects() {
		return this._objects;
	}

    /**
	 *
     * @param {Particle} value
     * @returns {SceneControls}
     */
    addObject(value) {
        this._objects.push(value);
        return this;
    }

    /**
     *
     * @param {Particle} value
     * @returns {SceneControls}
     */
    removeObject(value) {
        for (let i = 0; i < this._objects.length; i++) {
            let particle = this._objects[i];
            if (particle.id === value.id) {
                this._objects.splice(i, 1);
                this.scene.remove(particle.model);
                break;
            }
        }
        return this;
    }
	
	/**
	 * @callback updatePlayerListener
	 */
	
	/**
	 *
	 * @param {updatePlayerListener} listener
	 * @return {SceneControls}
	 */
	addPlayerListener(listener) {
		this._updateListener.push(listener);
		return this;
	}

    /**
	 * @param {Vector3} target
	 * @param {Array} chargeIds
     * @callback shotPlayerListener
     */

    /**
     *
     * @param {shotPlayerListener} listener
     * @return {SceneControls}
     */
    shotListener(listener) {
        this._shotListener.push(listener);
        return this;
	}

    /**
     * @param {Vector3} position
     * @callback collisionPlayerListener
     */

    /**
     *
     * @param {collisionPlayerListener} listener
     * @return {SceneControls}
     */
    collisionListener(listener) {
        this._collisionListener.push(listener);
        return this;
	}
	
	/**
	 *
	 * @param {PlayerInfo} playerInfo
	 * @return {SceneControls}
	 */
	addPlayer(playerInfo) {
		
		let id = playerInfo['id'];
		let player = new Player(this, false, id);
		
		// 1. set ship inf
		player.setSocketInfo(playerInfo);
		// 2. prepare model
		player.prepareModel();
		// 3. update engine
		player.ship.engine.setSocketInfo(playerInfo['e']);
		// 4. update fly control
		player.flyControls.setSocketInfo(playerInfo['fly']);
		player.enable(true, false);
		
		let model = player.getModel();
		model.position.copy(player.position);
		model.rotation.copy(player.rotation);
		
		this.scene.add(model);
		this._players[id] = player;
        this._objects.push(player.ship);
		return this;
	}
	
	/**
	 *
	 * @param {string|number} id
	 * @returns {?Player}
	 */
	getPlayer(id) {
		return this._players.hasOwnProperty(id) ? this._players[id] : null;
	}
	
	/**
	 *
	 * @param {string|number} id
	 * @return {SceneControls}
	 */
	destroyPlayer(id) {
		if (this._players.hasOwnProperty(id)) {
			let model = this._players[id].getModel();
			this.scene.remove(model);
			for (let child of model.children) {
				model.remove(child);
			}
			delete this._players[id];
		}
		return this;
	}

    /**
	 *
     * @returns {SceneControls}
     */
	hideTarget() {
        this.targetControls.setSelected(null);
        this.player.ship.aim.signatureRightTop.hide();
        return this;
	}

    /**
	 *
     * @param {Particle} particle
     * @returns {boolean}
     */
	isTarget(particle) {
        let targetSelected = this.targetControls.getSelectedParticle();
        return targetSelected && targetSelected.id === particle.id;
	}
	
	/**
	 *
	 * @returns {SceneControls}
	 */
	start() {

		this.player.prepareModel();
		this.camera.add(this.player.getAim());
		this.camera.add(this.player.getModel());
		this.scene.add(this.camera);
		
		this.player.keyboards.addEventListener(
			KeyboardControls.EVENT_KEY_UP,
			KeyboardControls.GROUP_PK,
			(event, keyboard) => {
				if (keyboard.key === 'openConsole') {
					if (keyboard.value === keyboard.valueOn) {
						// Enable fly actions
						this.player.cursor(true);
						this.player.keyboards.enableGroup(KeyboardControls.GROUP_FLY);
						// Hide console of ship
						// ...
					} else {
						// Disable fly actions
						this.player.cursor(false);
						this.player.keyboards.disableGroup(KeyboardControls.GROUP_FLY);
						// Open console of ship
						// ...
					}
				}
			}
		);
		
		this.player.keyboards.addEventListener(
			KeyboardControls.EVENT_MOUSE_DOWN_CENTER,
			KeyboardControls.GROUP_TARGET,
			() => {
				let openConsole = this.player.keyboards.fly.openConsole;
				if (openConsole.value === openConsole.valueOn) {
					this.hideTarget();
					// this.targetControls.setSelected(null);
					// this.player.ship.aim.signatureRightTop.hide();
				}
			}
		);
		
		this.player.keyboards.addEventListener(
			KeyboardControls.EVENT_MOUSE_DOWN_LEFT,
			KeyboardControls.GROUP_FLY,
			() => {
				let target = this.getNextPosition(this.camera, 250000);
				let chargeIds = this.player.shot(target, {}, (position, id) => {
					for (let collisionListener of this._collisionListener) {
                        collisionListener(position, id);
					}
				});
                for (let shotPlayerListener of this._shotListener) {
                    shotPlayerListener(target, chargeIds);
                }
			}
		);
		
		this.player.keyboards.addEventListener(
			KeyboardControls.EVENT_MOUSE_WHEEL,
			KeyboardControls.GROUP_TARGET,
			(event) => {
				let openConsole = this.player.keyboards.fly.openConsole;
				if (event.deltaY !== 0 && openConsole.value === openConsole.valueOn) {
					this.targetControls.changeTarget(
						this.getObjects(),
						event.deltaY < 0 ? -1 : 1,
						(element) => {
							let signature = this.player.ship.aim.signatureRightTop;
							if (element) {
								let distance = Math.round(this.camera.position.distanceTo(element.model.position));
								signature.setText(distance, element.label);
								signature.show();
							} else {
								signature.hide();
							}
						},
						(element, target, box) => {
							let signature = this.player.ship.aim.signatureRightTop;
							if (element) {
								let distance = Math.round(this.camera.position.distanceTo(element.model.position));
								signature.update(distance);

								let x = box.x,
									y = box.y,
									z = box.z;

								let size = Math.max(Math.max(x, y), z) / 2;

								if (distance < size) {
									target.hide();
								} else {
									target.show();
								}
							}
						}
					);
				}
			}
		);
		
		this.player
			.addEventListener(Player.EVENT_ENABLED, () => {
				// Enable fly actions
				this.player.cursor(true);
				this.player.keyboards.enableGroup(KeyboardControls.GROUP_FLY);
			})
			.addEventListener(Player.EVENT_DISABLED, () => {
				// Disable fly actions
				this.player.cursor(false);
				this.player.keyboards.disableGroup(KeyboardControls.GROUP_FLY);
			})
			.enable(true, true);

		// Disable fly actions before start
		this.player.cursor(false);
		this.player.keyboards.disableGroup(KeyboardControls.GROUP_FLY);
		// Open console of ship before start fly
		// ...
		
		this._animate();
		this._render();
		
		return this;
	}
	
	/**
	 *
	 * @returns {SceneControls}
	 */
	init() {
		// let s = 150;
		// let cube = new THREE.BoxGeometry(s, s, s);
		// let material = new THREE.MeshPhongMaterial({color: 0xffffff});
		// let mesh = new THREE.Mesh(cube, material);
		// mesh.position.z = - 500;
		// mesh.rotation.x = Math.PI / 4;
		// mesh.rotation.y = Math.PI / 4;
		// mesh.rotation.z = Math.PI / 4;
		// mesh.matrixAutoUpdate = false;
		// mesh.updateMatrix();
		// this.scene.add(mesh);
		
		let s = 50;
		let cube = new THREE.BoxGeometry(s, s, s);
		let material = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 50});
		for (let i = 0; i < 10; i ++) {
			let mesh = new THREE.Mesh(cube, material);
			mesh.position.x = 500 * (2.0 * Math.random() - 1.0);
			mesh.position.y = 500 * (2.0 * Math.random() - 1.0);
			mesh.position.z = - 2000;// * (2.0 * Math.random() - 1.0);
			mesh.rotation.x = Math.random() * Math.PI;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = Math.random() * Math.PI;
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();



			this.scene.add(mesh);
			
			let particle = new Particle('Particle', 'test-cube');
			particle.model = mesh;
			particle.label = 'Cube - ' + i;
			this.addObject(particle);
		}
		
		// lights
		let dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
		dirLight.position.set(0, -1, 0).normalize();
		this.scene.add(dirLight);
		dirLight.color.setHSL(0.1, 0.7, 0.5);
		
		
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0xf0f0f0);
		this.renderer.setSize(SceneControlsPlugin.width, SceneControlsPlugin.height);
		this.container.appendChild(this.renderer.domElement);
		this.renderer.gammaInput = false;
		this.renderer.gammaOutput = false;
		// this.renderer.sortObjects = false;
		this._onWindowResize();
		return this;
	}
	
	/**
	 * Animation elements
	 *
	 * @private
	 */
	_animate() {
		setTimeout(() => {
			this._animate();
			let delta = this._clockAnimate.getDelta();
			if (this.player.isEnabled) {
				this.player.ship.aim.signatureLeftTop.update(
					Math.round(this.player.ship.engine.speedZ)
				);

				for (let listener of this._updateListener) {
					listener();
				}
			}
		}, FPS);
	}
	
	/**
	 * Main render elements
	 *
	 * @returns {void}
	 * @private
	 */
	_render() {

        this._stats.begin();

		window.requestAnimationFrame(() => {
			this._render();
		});
		
		let delta = this._clockRender.getDelta();
		if (this.player.isEnabled) {
			this.flyControls.updateUserControl(delta);
			this.skyBoxControls.update(this.camera.position);
			this.player.position.copy(this.camera.position);
			this.player.rotation.copy(this.camera.rotation);
			this.player.update(delta);
			this.targetControls.update();

            for (let playerId in this._players) {
                if (this._players.hasOwnProperty(playerId)) {
                    this._players[playerId].update(delta);
                }
            }
		}
		
		this.renderer.render(this.scene, this.camera);

        this._stats.end();
	}
	
	/**
	 *
	 * @returns {void}
	 * @private
	 */
	_onWindowResize() {
		window.addEventListener(
			'resize',
			() => {
				this.camera.aspect = SceneControlsPlugin.aspect;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(SceneControlsPlugin.width, SceneControlsPlugin.height);
			},
			false
		);
	}
	
	/**
	 *
	 * @param {Object} obj
	 */
	doDispose(obj) {
		if (obj !== null) {
			for (let i = 0; i < obj.children.length; i++) {
				this.doDispose(obj.children[i]);
			}
			if (obj.geometry) {
				obj.geometry.dispose();
				obj.geometry = undefined;
			}
			if (obj.material) {
				if (obj.material.map) {
					obj.material.map.dispose();
					obj.material.map = undefined;
				}
				obj.material.dispose();
				obj.material = undefined;
			}
		}
		obj = undefined;
	};
}

export default SceneControls;