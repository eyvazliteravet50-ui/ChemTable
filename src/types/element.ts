export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export type MetalClass = 'metal' | 'metalloid' | 'nonmetal';

export type StateAtSTP = 'solid' | 'liquid' | 'gas';

export type OrbitalBlock = 's' | 'p' | 'd' | 'f';

export type OxideAcidity =
  | 'strongly-basic'
  | 'basic'
  | 'amphoteric'
  | 'weakly-acidic'
  | 'acidic'
  | 'strongly-acidic'
  | 'neutral';

export type PropertyMode =
  | 'category'
  | 'metal-class'
  | 'atomic-radius'
  | 'acidity'
  | 'ionization-energy'
  | 'electronegativity'
  | 'electron-affinity'
  | 'state-temperature'
  | 'melting-point'
  | 'boiling-point'
  | 'density'
  | 'block';

export type MainView = 'table' | 'trends' | 'compare' | 'database';

export type TempUnit = 'C' | 'K';

export interface ChemicalElement {
  number: number;
  symbol: string;
  nameAz: string;
  nameLatin: string;
  atomicMass: string;
  atomicMassNum: number;
  group: number;
  period: number;
  gridRow: number;
  gridCol: number;
  block: OrbitalBlock;
  category: ElementCategory;
  metalClass: MetalClass;
  stateAtSTP: StateAtSTP;
  electronConfig: string;
  shells: number[];
  electronegativity: number | null;
  atomicRadius: number | null; // pm (empirical or calculated van der Waals / metallic / covalent-adjusted standard)
  covalentRadius: number | null; // pm
  ionizationEnergy: number | null; // 1st ionization energy in kJ/mol
  electronAffinity: number | null; // kJ/mol
  meltingPointK: number | null; // Kelvin
  boilingPointK: number | null; // Kelvin
  density: number | null; // g/cm³ (or g/L at 273 K for gases converted or noted)
  oxideAcidity: OxideAcidity;
  oxideFormula: string;
  oxidationStates: string;
  crystalStructure: string;
  discoveryYear: string;
  discoverer: string;
  abundanceCrust: string;
  summaryAz: string;
}
