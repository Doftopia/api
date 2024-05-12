import * as express from "express";
import * as cors from "cors";
import * as mysql from "mysql2/promise";
import { Request, Response } from "express";
import { ParsedQs } from "qs";
import {
  Item,
  GroupedItems,
  RecipeResult,
  GroupedNmbItems,
  NmbItems,
  Recipe,
  Charac,
  Mob,
  MobCharac,
  GroupedMob,
  DropsByMob,
  Drop,
  MobDrop,
} from "./interfaces";

const app = express();
const port = 3001;

interface GroupedRecipes {
  resultItemId: number;
  craftedName: string;
  recipeLevel: number;
  jobId: number;
  itemLevel: string;
  recipe: Recipe[];
}

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
  cors()
);

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "doftopia_api",
};

const pool = mysql.createPool(dbConfig);

app.get("/items", async (req: Request, res: Response) => {
  let itemQuery = `SELECT items.name AS itemName, characteristics.name AS characName, items.id as itemId, characteristics.img_url as characImg, items.description as itemDescription, items.level, items.type, items.img, items.imgHighRes, items.apCost, items.maxRange, items.minRange, effects.description as effectDescription, items.nmbCast, items.criticalHitProbability, items.weaponDmgFrom as characFrom, items.weaponDmgTo as characTo, items.itemCharacteristics as characId, setName, setId, effectId FROM items LEFT JOIN characteristics ON items.itemCharacteristics = characteristics.characteristic_id LEFT JOIN effects on items.effectId = effects.id`;
  let base_limit: number = 10;
  let base_skip: number = 0;
  let item_limit = base_limit;
  let skip_limit = base_skip;
  const queryParams = [];
  const filters = [];

  if (req.query.id) {
    if (Array.isArray(req.query.id)) {
      let placeholders = req.query.id.map((id) => "?").join(",");
      filters.push(`items.id IN (${placeholders})`);
      queryParams.push(...req.query.id);
    } else {
      filters.push(`items.id = ?`);
      queryParams.push(req.query.id);
    }
  }

  if (req.query.name) {
    filters.push(`items.name LIKE ?`);
    queryParams.push(`%${req.query.name}%`);
  }

  if (req.query.setId) {
    filters.push(`items.setId = ?`);
    queryParams.push(req.query.setId);
  }

  if (req.query.minLevel) {
    filters.push(`items.level >= ?`);
    queryParams.push(req.query.minLevel);
  }

  if (req.query.maxLevel) {
    filters.push(`items.level <= ?`);
    queryParams.push(req.query.maxLevel);
  }

  if (req.query.effect) {
    const effects = Array.isArray(req.query.effect)
      ? req.query.effect
      : [req.query.effect];
    effects.forEach((effect: ParsedQs | string) => {
      filters.push(`items.name IN (
                SELECT DISTINCT
                items.name
                FROM
                items
                LEFT JOIN
                characteristics ON items.itemCharacteristics = characteristics.characteristic_id
                WHERE
                characteristics.characteristic_id LIKE ?
                AND items.weaponDmgFrom > 0
                )`);
      queryParams.push(effect);
    });
  }

  if (req.query.category) {
    const categories = Array.isArray(req.query.category)
      ? req.query.category
      : [req.query.category];
    const categoryFilters = categories
      .map(() => `items.type like ?`)
      .join(" OR ");
    filters.push(`(${categoryFilters})`);
    categories.forEach((category: ParsedQs | string) => {
      queryParams.push(category);
    });
  }

  if (filters.length > 0) {
    itemQuery += ` WHERE ${filters.join(" AND ")}`;
  }

  if (req.query.limit) {
    base_limit = Number(req.query.limit);
  }

  if (req.query.skip) {
    base_skip = Number(req.query.skip);
  }

  let groupedData: GroupedItems[] = [];

  item_limit = base_limit;
  skip_limit = base_skip;

  const element_to_icon: { [key: string]: string } = {
    Neutre: "https://dofusdb.fr/icons/characteristics/tx_neutral.png",
    Feu: "https://dofusdb.fr/icons/characteristics/tx_intelligence.png",
    Eau: "https://dofusdb.fr/icons/characteristics/tx_chance.png",
    Terre: "https://dofusdb.fr/icons/characteristics/tx_strength.png",
    Air: "https://dofusdb.fr/icons/characteristics/tx_agility.png",
  };

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);

    (results as Item[]).forEach((result: Item, index: number) => {
      if (index >= base_limit) {
        return;
      }
      try {
        if (result.characId == -1) {
          for (const element in element_to_icon) {
            if (result.effectDescription.includes(element)) {
              result.characImg = element_to_icon[element];
              break;
            }
          }
        }

        let existingItem = groupedData.find(
          (item) => item.itemName === result.itemName
        );
        if (result.effectDescription !== null) {
          result.effectDescription = result.effectDescription.split("2")[2];
          if (result.effectDescription !== undefined) {
            if (result.effectDescription.includes("{~ps}{~zs}")) {
              result.effectDescription = `${
                result.effectDescription.split("{")[0]
              } ${result.effectDescription.split("}")[2]}`;
            }
          }
        }
        if (!existingItem) {
          existingItem = {
            itemName: result.itemName,
            itemId: result.itemId,
            description: result.itemDescription,
            level: result.level,
            type: result.type,
            img: result.img,
            imgHighRes: result.imgHighRes,
            apCost: result.apCost,
            minRange: result.minRange,
            maxRange: result.maxRange,
            nmbCast: result.nmbCast,
            criticalHitProbability: result.criticalHitProbability,
            setName: result.setName,
            setID: result.setId,
            characteristics: [],
          };
          groupedData.push(existingItem);
        } else {
          base_limit += 1;
        }
        existingItem.characteristics.push({
          characName: result.effectDescription,
          characFrom: result.characFrom,
          characTo: result.characTo,
          characImg: result.characImg,
          characId: result.characId,
          effectId: result.effectId,
        });
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(`Error fetching items: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
  res.json({
    limit: item_limit,
    skip: skip_limit,
    data: groupedData.slice(base_skip, base_limit),
  });
});

app.get("/jobs", async (req: Request, res: Response) => {
  let itemQuery = `SELECT * from jobs`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE jobs.jobId = ?`;
    queryParams.push(req.query.id);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching jobs: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/items-type", async (req: Request, res: Response) => {
  let itemQuery = `SELECT * from itemsType`;
  const queryParams = [];

  if (req.query.category) {
    itemQuery += ` WHERE itemstype.name LIKE ?`;
    queryParams.push(`%${req.query.category}%`);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

app.get("/achievements", async (req: Request, res: Response) => {
  let itemQuery = `SELECT  
  achievements.name AS AchievementName,
  achievements.description AS AchievementDesc,
  achievements.points AS AchievementPoints,
  achievements.img AS AchievementImg,
  achievements.id AS AchievementId,
  achievements.level AS AchievementLevel,
  achievements_categories.name AS CategoryName,
  achievements_rewards.kamasRatio,
  achievements_rewards.experienceRatio,
  achievements_rewards.itemsReward,
  achievements_rewards.emotesReward,
  achievements_rewards.spellsReward,
  achievements_rewards.titlesReward,
  achievements_rewards.ornamentsReward,
  achievements_categories.id AS CategoryId
FROM achievements
LEFT JOIN achievements_categories ON achievements.category_id = achievements_categories.id
LEFT JOIN achievements_rewards ON achievements.id = achievements_rewards.achievement_id
`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE achievements.id = ?`;
    queryParams.push(req.query.id);
  }

  if (req.query.category) {
    itemQuery += ` WHERE achievements_categories.name = ?`;
    queryParams.push(req.query.category);
  }

  if (req.query.categoryId) {
    itemQuery += ` WHERE achievements_categories.id = ?`;
    queryParams.push(req.query.categoryId);
  }

  if (req.query.name) {
    itemQuery += ` WHERE achievements.name LIKE ?`;
    queryParams.push(`%${req.query.name}%`);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching achievements: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/achievements-categories", async (req: Request, res: Response) => {
  let itemQuery = `SELECT * from achievements_categories`;
  const queryParams = [];

  if (req.query.Id) {
    itemQuery += ` WHERE id = ?`;
    queryParams.push(req.query.id);
  }

  if (req.query.parentId) {
    itemQuery += ` WHERE parentId = ?`;
    queryParams.push(req.query.parentId);
  }

  if (req.query.name) {
    itemQuery += ` WHERE name LIKE ?`;
    queryParams.push(`%${req.query.name}%`);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching achievements categories: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/achievements-objectives", async (req: Request, res: Response) => {
  let itemQuery = `SELECT * from achievement_objectives`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE achievement_id = ?`;
    queryParams.push(req.query.id);
  }

  if (req.query.achievement_id) {
    itemQuery += ` WHERE achievement_id = ? ORDER BY achievement_objectives.order`;
    queryParams.push(req.query.achievement_id);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching achievements objectives: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/recipes", async (req: Request, res: Response) => {
  let itemQuery = `SELECT 
  recipes.jobId,
  recipes.resultId,
  craftedItem.name AS craftedName,
  recipes.quantities,
  recipes.ids,
  GROUP_CONCAT(items.name) AS itemName,
  GROUP_CONCAT(items.img) AS itemImg,
  GROUP_CONCAT(items.level) AS itemLevel,
  MAX(craftedItem.level) AS recipeLevel
FROM 
  recipes 
  LEFT JOIN 
  items ON items.id = recipes.ids
LEFT JOIN
  items AS craftedItem ON craftedItem.id = recipes.resultId`;

  const queryParams = [];
  if (req.query.jobId) {
    itemQuery += ` WHERE recipes.jobId = ?`;
    queryParams.push(req.query.jobId);
  }

  if (req.query.resultId) {
    if (itemQuery.includes("WHERE")) {
      itemQuery += ` AND recipes.resultId = ?`;
    } else {
      itemQuery += ` WHERE recipes.resultId = ?`;
    }
    queryParams.push(req.query.resultId);
  }

  if (req.query.lvl) {
    if (itemQuery.includes("WHERE")) {
      itemQuery += ` AND craftedItem.level <= ?`;
    } else {
      itemQuery += ` WHERE craftedItem.level <= ?`;
    }
    queryParams.push(req.query.lvl);
  }

  itemQuery += `GROUP BY 
  recipes.resultId, 
  recipes.quantities, 
  recipes.ids, 
  recipes.jobId
  ORDER BY
    recipes.quantities DESC;`;

  let groupedData: GroupedRecipes[] = [];
  let recipe: Recipe[] = [];
  let previousItemId: number = 0;

  try {
    const [results, fields] = await pool.query(itemQuery, queryParams);
    const rows = results as RecipeResult[];

    if (rows.length > 0) {
      previousItemId = rows[0].resultId;
    }

    (results as RecipeResult[]).forEach((result: RecipeResult) => {
      try {
        if (previousItemId != result.resultId) {
          groupedData.push({
            resultItemId: previousItemId,
            recipeLevel: result.recipeLevel,
            craftedName: result.craftedName,
            jobId: result.jobId,
            itemLevel: result.itemLevel,
            recipe: recipe,
          });
          previousItemId = result.resultId;
          recipe = [];
        }
        recipe.push({
          quantity: result.quantities,
          itemName: result.itemName,
          itemId: result.ids,
          itemImg: result.itemImg,
        });
      } catch (error) {
        console.error(error);
      }
    });

    try {
      if (rows.length > 0) {
        groupedData.push({
          resultItemId: previousItemId,
          craftedName: rows[rows.length - 1].craftedName,
          jobId: rows[rows.length - 1].jobId,
          itemLevel: rows[rows.length - 1].itemLevel,
          recipeLevel: rows[rows.length - 1].recipeLevel,
          recipe: recipe,
        });
      }
    } catch (error) {
      console.log(`trying to access an item without characs: ${error}`);
    }

    res.json({ data: groupedData });
  } catch (error) {
    console.error(`Error fetching recipes: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

app.get("/itemSets", async (req: Request, res: Response) => {
  let itemQuery = `SELECT * from itemSets
    join characteristics on itemSets.charac = characteristics.characteristic_id`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE itemSets.setId = ?`;
    queryParams.push(req.query.id);
  }

  let groupedData: GroupedNmbItems[] = [];
  let charac: Charac[] = [];
  let nmbItems: NmbItems[] = [];
  let previousSetId: number = 0;
  let previousNmbItems: number = 0;

  try {
    const [results, fields] = await pool.query(itemQuery, queryParams);
    const rows = results as Item[];

    if (rows.length > 0) {
      previousSetId = rows[0].setId;
      previousNmbItems = rows[0].numberItem;
    }

    (results as Item[]).forEach((result: Item, index: number) => {
      try {
        if (previousNmbItems != result.numberItem || index == rows.length - 1) {
          if (index == rows.length - 1) {
            charac.push({
              characName: result.name,
              characValue: result.characValue,
              characImg: result.img_url,
            });
            nmbItems.push({ characs: charac, nmbItems: previousNmbItems });
          } else {
            nmbItems.push({ characs: charac, nmbItems: previousNmbItems });
          }
          previousNmbItems = result.numberItem;
          charac = [];
        }

        if (previousSetId != result.setId) {
          groupedData.push({
            nmbItems: nmbItems,
            setName: result.setName,
            setId: result.setId,
            setLevel: result.setLevel,
          });
          previousSetId = result.setId;
          nmbItems = [];
        }
        charac.push({
          characName: result.name,
          characValue: result.characValue,
          characImg: result.img_url,
        });
      } catch (error) {
        console.error(`error parsing set ${error}`);
      }
    });
    groupedData.push({
      nmbItems: nmbItems,
      setName: rows[rows.length - 1].setName,
      setId: rows[rows.length - 1].setId,
      setLevel: rows[rows.length - 1].setLevel,
    });
    res.json({ data: groupedData });
  } catch (error) {
    console.error(`Error fetching sets: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

app.get("/mobs", async (req: Request, res: Response) => {
  let groupedData: GroupedMob[] = [];
  let mobCharac: MobCharac[] = [];
  let base_limit = 40;
  let base_offset = 0;
  let previousMobID = 0;
  let itemQuery = `SELECT * from mobs`;
  const queryParams = [];
  let previousMobName = "";
  let previousMobImg = "";

  if (req.query.id) {
    let ids: number[] = [];
    if (Array.isArray(req.query.id)) {
      ids = req.query.id.map(Number);
    } else {
      ids = [Number(req.query.id)];
    }

    const placeholders = ids.map(() => "?").join(",");
    itemQuery += ` WHERE id IN (${placeholders})`;
    queryParams.push(...ids);
  }

  if (req.query.name) {
    itemQuery += ` WHERE name LIKE ?`;
    queryParams.push(`%${req.query.name}%`);
  }

  if (req.query.limit) {
    base_limit = Number(req.query.limit);
  }

  if (req.query.offset) {
    base_offset = Number(req.query.offset);
  }

  let limit = base_limit;
  try {
    const [results, fields] = await pool.query(itemQuery, queryParams);
    const rows = results as Mob[];

    if (rows.length != 0) {
      previousMobID = rows[0].id;
      previousMobName = rows[0].name;
      previousMobImg = rows[0].img;
    }

    (results as Mob[]).forEach((result: Mob, index: number) => {
      if (index >= limit) {
        return;
      }
      if (
        result.id != previousMobID ||
        (result.id == rows[rows.length - 1].id &&
          result.lifePoints == rows[rows.length - 1].lifePoints)
      ) {
        groupedData.push({
          name: previousMobName,
          id: previousMobID.toString(),
          characs: mobCharac,
          img: previousMobImg,
        });
        previousMobID = result.id;
        previousMobName = result.name;
        previousMobImg = result.img;
        mobCharac = [];
        mobCharac.push({
          level: result.level,
          lifePoints: result.lifePoints,
          ap: result.actionPoints,
          mp: result.mouvementPoints,
          vitality: result.vitality,
          paDodge: result.paDodge,
          pmDodge: result.pmDodge,
          wisdom: result.wisdom,
          earthResistance: result.earthResistance,
          fireResistance: result.fireResistance,
          airResistance: result.airResistance,
          waterResistance: result.waterResistance,
          neutralResistance: result.neutralResistance,
          strength: result.strength,
          intelligence: result.intelligence,
          chance: result.chance,
          agility: result.agility,
        });
      } else {
        limit += 1;
        mobCharac.push({
          level: result.level,
          lifePoints: result.lifePoints,
          ap: result.actionPoints,
          mp: result.mouvementPoints,
          vitality: result.vitality,
          paDodge: result.paDodge,
          pmDodge: result.pmDodge,
          wisdom: result.wisdom,
          earthResistance: result.earthResistance,
          fireResistance: result.fireResistance,
          airResistance: result.airResistance,
          waterResistance: result.waterResistance,
          neutralResistance: result.neutralResistance,
          strength: result.strength,
          intelligence: result.intelligence,
          chance: result.chance,
          agility: result.agility,
        });
      }
    });
    res.json({ limit: base_limit, total: rows.length, data: groupedData });
  } catch (error) {
    console.error(`Error fetching mobs: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

app.get("/mobs-drop", async (req: Request, res: Response) => {
  let previousMobId = 0;
  let drops: Drop[] = [];
  let groupedData: DropsByMob[] = [];
  let itemQuery = `SELECT * from mobsDrop`;
  const queryParams = [];

  if (req.query.mobId) {
    itemQuery += ` WHERE mobId = ?`;
    queryParams.push(req.query.mobId);
  }

  if (req.query.dropId) {
    itemQuery += ` WHERE dropId = ?`;
    queryParams.push(req.query.dropId);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    const rows = results as MobDrop[];

    if (rows.length != 0) {
      previousMobId = rows[0].mobId;
    }

    (results as MobDrop[]).forEach((mobDrop: MobDrop) => {
      if (mobDrop.mobId != previousMobId) {
        groupedData.push({ mobId: previousMobId, dropsId: drops });
        previousMobId = mobDrop.mobId;
        drops = [];
      } else {
        drops.push({
          id: mobDrop.dropId,
          dropPourcentage: mobDrop.pourcentageDrop,
          criteria: Number(mobDrop.criteria),
        });
      }
    });
    groupedData.push({ mobId: previousMobId, dropsId: drops });
    res.json({ data: groupedData });
  } catch (error) {
    console.error(`Error fetching mobs drop: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

app.get("/quests", async (req: Request, res: Response) => {
  let itemQuery = `SELECT quests.id as questId,
  quests.name as questName,
  quests.levelMin as minLvl,
  quests.categoryId as categoryId,
  quest_categories.name as categoryName,
  quests.stepIds as steps
FROM quests
LEFT JOIN quest_categories ON quest_categories.id  = quests.categoryId`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE questId = ? ORDER BY minLvl ASC`;
    queryParams.push(req.query.id);
  }

  if (req.query.category) {
    itemQuery += ` WHERE categoryId = ? ORDER BY minLvl ASC`;
  }

  if (req.query.name) {
    itemQuery += ` WHERE quests.name LIKE ? ORDER BY minLvl ASC`;
    queryParams.push(`%${req.query.name}%`);
  }

  if (req.query.categoryName) {
    itemQuery += ` WHERE quest_categories.name = ? ORDER BY minLvl ASC`;
    queryParams.push(req.query.categoryName);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching quests: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/quests-categories", async (req: Request, res: Response) => {
  let itemQuery = `SELECT quest_categories.id AS questId,
  quest_categories.name AS questCategory,
  quest_categories.order AS 'order'
  FROM quest_categories;`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE questId = ?`;
    queryParams.push(req.query.id);
  }

  if (req.query.category) {
    itemQuery += ` WHERE category = ?`;
    queryParams.push(req.query.category);
  }

  if (req.query.name) {
    itemQuery += ` WHERE name LIKE ?`;
    queryParams.push(`%${req.query.name}%`);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching quests: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/quests-steps", async (req: Request, res: Response) => {
  let itemQuery = `SELECT * from quest_steps`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE id = ?`;
    queryParams.push(req.query.id);
  }

  if (req.query.questId) {
    itemQuery += ` WHERE questId = ?`;
    queryParams.push(req.query.questId);
  }

  if (req.query.stepId) {
    itemQuery += ` WHERE stepId = ?`;
    queryParams.push(req.query.stepId);
  }

  if (req.query.name) {
    itemQuery += ` WHERE name LIKE ?`;
    queryParams.push(`%${req.query.name}%`);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching quests steps: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/quests-steps-rewards", async (req: Request, res: Response) => {
  let itemQuery = `SELECT * from quest_steps_rewards`;
  const queryParams = [];

  if (req.query.id) {
    itemQuery += ` WHERE id = ?`;
    queryParams.push(req.query.id);
  }

  if (req.query.questId) {
    itemQuery += ` WHERE questId = ?`;
    queryParams.push(req.query.questId);
  }

  if (req.query.stepId) {
    itemQuery += ` WHERE stepId = ?`;
    queryParams.push(req.query.stepId);
  }

  if (req.query.rewardId) {
    itemQuery += ` WHERE rewardId = ?`;
    queryParams.push(req.query.rewardId);
  }

  if (req.query.name) {
    itemQuery += ` WHERE name LIKE ?`;
    queryParams.push(`%${req.query.name}%`);
  }

  try {
    const [results, _] = await pool.query(itemQuery, queryParams);
    res.json({ data: results });
  } catch (error) {
    console.error(`Error fetching quests steps rewards: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
