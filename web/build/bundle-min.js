class Includes{constructor(){this.includes=[]}getKeyAndName(){let e={};for(let s of this.includes)e[s.key]=s.name;return e}getAll(){return this.includes}get(e){let s=this.includes.find(s=>s.key===e);return s||null}}export default Includes;import ParticleError from"./ParticleError";class Particle{constructor(e,s){this.id="",this.key=s,this.type=e,this.name=null,this.label=null,this.description=null,this.particleClass=null,this.children=[]}clone(){return Object.assign(Object.create(this),this)}toJson(){return JSON.stringify(this)}fromJson(e,s=!0){try{let r=JSON.parse(e);r.type!==this.type&&s&&new ParticleError("You tried to set not correct object");for(let e in r)if(r.hasOwnProperty(e))if(this.hasOwnProperty(e))switch(e){case"children":break;default:this[e]=r[e]}else s&&console.warn('Property "'+e+'" does not exists in the "'+this.type+'"')}catch(e){console.log(e)}return this}}export default Particle;class ParticleError extends Error{constructor(e,s=null,r=!0){if(super(e,s),r)throw this}}export default ParticleError;import Particle from"./../Particle";class ParticleClass extends Particle{constructor(e,s){super(e,s)}static I_CLASS_KEY(){return 1}static II_CLASS_KEY(){return 2}static III_CLASS_KEY(){return 3}}export default ParticleClass;import ParticleClass from"./ParticleClass";class ParticleClassI extends ParticleClass{constructor(){super("ParticleClassI",ParticleClass.I_CLASS_KEY),this.name="I"}}export default ParticleClassI;import ParticleClass from"./ParticleClass";class ParticleClassII extends ParticleClass{constructor(){super("ParticleClassII",ParticleClass.II_CLASS_KEY),this.name="II"}}export default ParticleClassII;import ParticleClass from"./ParticleClass";class ParticleClassIII extends ParticleClass{constructor(){super("ParticleClassIII",ParticleClass.III_CLASS_KEY),this.name="III"}}export default ParticleClassIII;import Includes from"./../Includes";import ParticleClassI from"./ParticleClassI";import ParticleClassII from"./ParticleClassII";import ParticleClassIII from"./ParticleClassIII";class ParticleClassIncludes extends Includes{constructor(){super(),this.includes=[new ParticleClassI,new ParticleClassII,new ParticleClassIII]}}export default ParticleClassIncludes;import User from"./User";import Ship from"./../particles/ships/Ship";import ShipExplorerI from"./../particles/ships/I/ShipExplorerI";class Player extends User{constructor(){super(),this.ship=new ShipExplorerI}}export default Player;class User{constructor(){}}export default User;import Particle from"./../../Particle";class Ship extends Particle{constructor(e,s){super(e,s),this.engine=null}static I_EXPLORER_KEY(){return"I_EXPLORER_KEY"}static II_EXPLORER_KEY(){return"II_EXPLORER_KEY"}static III_EXPLORER_KEY(){return"III_EXPLORER_KEY"}}export default Ship;import Includes from"./../../Includes";import ShipExplorerI from"./I/ShipExplorerI";import ShipExplorerII from"./II/ShipExplorerII";import ShipExplorerIII from"./III/ShipExplorerIII";class ShipIncludes extends Includes{constructor(){super(),this.includes=[new ShipExplorerI,new ShipExplorerII,new ShipExplorerIII]}}export default ShipIncludes;import Particle from"./../../Particle";class Engine extends Particle{constructor(e,s){super(e,s),this.speedMin=0,this.speedMax=0,this.speed=0}static I_M20_KEY(){return"I_M20_KEY"}static II_M20_KEY(){return"II_M20_KEY"}static III_M20_KEY(){return"III_M20_KEY"}static I_M50_KEY(){return"I_M50_KEY"}static II_M50_KEY(){return"II_M50_KEY"}static III_M50_KEY(){return"III_M50_KEY"}static I_M100_KEY(){return"I_M100_KEY"}static II_M100_KEY(){return"II_M100_KEY"}static III_M100_KEY(){return"III_M100_KEY"}}export default Engine;import Includes from"./../../Includes";import EngineIM20 from"./I/EngineIM20";import EngineIM50 from"./I/EngineIM50";import EngineIM100 from"./I/EngineIM100";import EngineIIM20 from"./II/EngineIIM20";import EngineIIM50 from"./II/EngineIIM50";import EngineIIM100 from"./II/EngineIIM100";import EngineIIIM20 from"./III/EngineIIIM20";import EngineIIIM50 from"./III/EngineIIIM50";import EngineIIIM100 from"./III/EngineIIIM100";class EngineIncludes extends Includes{constructor(){super(),this.includes=[new EngineIM20,new EngineIM50,new EngineIM100,new EngineIIM20,new EngineIIM50,new EngineIIM100,new EngineIIIM20,new EngineIIIM50,new EngineIIIM100]}}export default EngineIncludes;import Ship from"./../Ship";import EngineIM20 from"./../../engine/I/EngineIM20";import ParticleClassI from"./../../../classes/ParticleClassI";class ShipExplorerI extends Ship{constructor(){super("ShipExplorerI",Ship.I_EXPLORER_KEY),this.particleClass=new ParticleClassI,this.engine=new EngineIM20}}export default ShipExplorerI;import Ship from"./../Ship";import ParticleClassII from"./../../../classes/ParticleClassII";import EngineIIM20 from"./../../engine/II/EngineIIM20";class ShipExplorerII extends Ship{constructor(){super("ShipExplorerII",Ship.II_EXPLORER_KEY),this.particleClass=new ParticleClassII,this.engine=new EngineIIM20}}export default ShipExplorerII;import Ship from"./../Ship";import ParticleClassIII from"./../../../classes/ParticleClassIII";import EngineIIIM20 from"./../../engine/III/EngineIIIM20";class ShipExplorerIII extends Ship{constructor(){super("ShipExplorerIII",Ship.III_EXPLORER_KEY),this.particleClass=new ParticleClassIII,this.engine=new EngineIIIM20}}export default ShipExplorerIII;import Engine from"../Engine";import ParticleClassII from"../../../classes/ParticleClassII";class EngineIIM100 extends Engine{constructor(){super("EngineIIM100",Engine.II_M100_KEY),this.particleClass=new ParticleClassII}}export default EngineIIM100;import Engine from"../Engine";import ParticleClassII from"../../../classes/ParticleClassII";class EngineIIM20 extends Engine{constructor(){super("EngineIIM20",Engine.II_M20_KEY),this.particleClass=new ParticleClassII}}export default EngineIIM20;import Engine from"../Engine";import ParticleClassII from"../../../classes/ParticleClassII";class EngineIIM50 extends Engine{constructor(){super("EngineIIM50",Engine.II_M50_KEY),this.particleClass=new ParticleClassII}}export default EngineIIM50;import Engine from"../Engine";import ParticleClassI from"../../../classes/ParticleClassI";class EngineIM100 extends Engine{constructor(){super("EngineIM100",Engine.I_M100_KEY),this.particleClass=new ParticleClassI}}export default EngineIM100;import Engine from"../Engine";import ParticleClassI from"../../../classes/ParticleClassI";class EngineIM20 extends Engine{constructor(){super("EngineIM20",Engine.I_M20_KEY),this.particleClass=new ParticleClassI}}export default EngineIM20;import Engine from"../Engine";import ParticleClassI from"../../../classes/ParticleClassI";class EngineIM50 extends Engine{constructor(){super("EngineIM50",Engine.I_M50_KEY),this.particleClass=new ParticleClassI}}export default EngineIM50;import Engine from"../Engine";import ParticleClassIII from"../../../classes/ParticleClassIII";class EngineIIIM100 extends Engine{constructor(){super("EngineIIIM100",Engine.III_M100_KEY),this.particleClass=new ParticleClassIII}}export default EngineIIIM100;import Engine from"../Engine";import ParticleClassIII from"../../../classes/ParticleClassIII";class EngineIIIM20 extends Engine{constructor(){super("EngineIIIM20",Engine.III_M20_KEY),this.particleClass=new ParticleClassIII}}export default EngineIIIM20;import Engine from"../Engine";import ParticleClassIII from"../../../classes/ParticleClassIII";class EngineIIIM50 extends Engine{constructor(){super("EngineIIIM50",Engine.III_M50_KEY),this.particleClass=new ParticleClassIII}}export default EngineIIIM50;
//# sourceMappingURL=maps/bundle-min.js.map