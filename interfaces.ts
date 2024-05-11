interface Item {
  itemName: string;
  characName: string;
  itemId: number;
  characImg: string;
  itemDescription: string;
  level: number;
  type: string;
  img: string;
  imgHighRes: string;
  apCost: number;
  maxRange: number;
  minRange: number;
  effectDescription: string;
  nmbCast: number;
  criticalHitProbability: number;
  characFrom: number;
  characTo: number;
  characId: number;
  setName: string;
  setId: number;
  effectId: number;
  setLevel: number;
  numberItem: number;
  name: string;
  characValue: number;
  img_url: string;
}

interface GroupedItems {
  itemName: string;
  itemId: number;
  description: string;
  level: number;
  type: string;
  img: string;
  imgHighRes: string;
  apCost: number;
  minRange: number;
  maxRange: number;
  nmbCast: number;
  criticalHitProbability: number;
  setName: string;
  setID: number;
  characteristics: Characteristic[];
}

interface Characteristic {
  characName: string;
  characFrom: number;
  characTo: number;
  characImg: string;
  characId: number;
  effectId: number;
}

interface Recipe {
  quantity: number;
  itemName: string;
  itemId: number;
  itemImg: string;
}

interface RecipeResult {
  resultId: number;
  quantities: number;
  ids: number;
  jobId: number;
  itemName: string;
  itemImg: string;
  itemLevel: string;
  itemId: number;
}

interface GroupedRecipes {
  resultItemId: number;
  jobId: number;
  itemLevel: string;
  recipe: Recipe[];
}

interface Charac {
  characName: string;
  characValue: number;
  characImg: string;
}

interface NmbItems {
  characs: Charac[];
  nmbItems: number;
}

interface GroupedNmbItems {
  nmbItems: NmbItems[];
  setName: string;
  setId: number;
  setLevel: number;
}

interface Mob {
  id: number;
  name: string;
  level: number;
  lifePoints: number;
  actionPoints: number;
  mouvementPoints: number;
  vitality: number;
  paDodge: number;
  pmDodge: number;
  wisdom: number;
  earthResistance: number;
  fireResistance: number;
  airResistance: number;
  waterResistance: number;
  neutralResistance: number;
  strength: number;
  intelligence: number;
  chance: number;
  agility: number;
  img: string;
}

interface MobCharac {
  level: number;
  lifePoints: number;
  ap: number;
  mp: number;
  vitality: number;
  paDodge: number;
  pmDodge: number;
  wisdom: number;
  earthResistance: number;
  fireResistance: number;
  airResistance: number;
  waterResistance: number;
  neutralResistance: number;
  strength: number;
  intelligence: number;
  chance: number;
  agility: number;
  [key: string]: number;
}

interface GroupedMob {
  name: string;
  id: string;
  characs: MobCharac[];
  img: string;
}

interface Category {
  name: string;
  index: number;
  array: string[];
}

interface Jobs {
  jobId: number;
  jobName: string;
}

interface DropsByMob {
  mobId: number;
  dropsId: Drop[];
}

interface Drop {
  id: number;
  dropPourcentage: number;
  criteria: number;
}

interface MobDrop {
  mobId: number;
  dropId: number;
  criteria: boolean;
  pourcentageDrop: number;
}

export type {
  Item,
  GroupedItems,
  RecipeResult,
  GroupedRecipes,
  GroupedNmbItems,
  NmbItems,
  Recipe,
  Charac,
  GroupedMob,
  Mob,
  MobCharac,
  Characteristic,
  Category,
  Jobs,
  DropsByMob,
  Drop,
  MobDrop,
};
