import axios from "axios";
import * as mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "doftopia_api",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchQuestsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS quests (
        id INT,
        name VARCHAR(250),
        stepIds JSON,
        levelMin INT,
        categoryId INT
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  await pool.execute(query);
  const insertQuestQuery =
    "INSERT INTO quests (id, name, stepIds, levelMin, categoryId) VALUES (?, ?, ?, ?, ?)";

  try {
    while (true) {
      const responseQuests = await axios.get(
        `https://api.beta.dofusdb.fr/quests?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const quests = responseQuests.data.data;
      if (quests.length === 0) {
        console.log("Ended quests fetching.");
        break;
      }
      for (const quest of quests) {
        try {
          const insertQuestParams = [
            quest.id,
            quest.name.fr,
            quest.stepIds,
            quest.levelMin,
            quest.categoryId,
          ];
          await pool.execute(insertQuestQuery, insertQuestParams);
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchQuestStepsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 2189;
  let query = `CREATE TABLE IF NOT EXISTS quest_steps (
        id INT,
        questId INT,
        name VARCHAR(100),
        description TEXT,
        dialogId INT,
        optimalLevel INT,
        objectiveIds  JSON
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  await pool.execute(query);
  const insertQuestStepQuery =
    "INSERT INTO quest_steps (id, questId, name, description, dialogId, optimalLevel, objectiveIds) VALUES (?, ?, ?, ?, ?, ?, ?)";
  try {
    while (true) {
      await delay(500);
      const responseQuestSteps = await axios.get(
        `https://api.beta.dofusdb.fr/quest-steps?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const questSteps = responseQuestSteps.data.data;
      if (questSteps.length === 0) {
        console.log("Ended quest steps fetching.");
        break;
      }
      for (const questStep of questSteps) {
        try {
          const insertQuestStepParams = [
            questStep.id,
            questStep.questId,
            questStep.name.fr,
            questStep.description.fr,
            questStep.dialogId,
            questStep.optimalLevel,
            JSON.stringify(questStep.objectiveIds),
          ];
          await pool.execute(insertQuestStepQuery, insertQuestStepParams);
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchQuestStepRewardsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 2600;
  let query = `CREATE TABLE IF NOT EXISTS quest_step_rewards (
        id INT,
        stepId INT,
        kamasRatio INT,
        experienceRatio INT,
        itemsReward JSON,
        emotesReward JSON,
        spellsReward JSON,
        titlesReward JSON
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  await pool.execute(query);
  const insertQuestStepRewardQuery =
    "INSERT INTO quest_step_rewards (id, stepId, kamasRatio, experienceRatio, itemsReward, emotesReward, spellsReward, titlesReward) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    while (true) {
      await delay(450);
      const responseQuestStepRewards = await axios.get(
        `https://api.beta.dofusdb.fr/quest-step-rewards?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const questStepRewards = responseQuestStepRewards.data.data;
      if (questStepRewards.length === 0) {
        console.log("Ended quest step rewards fetching.");
        break;
      }
      for (const questStepReward of questStepRewards) {
        try {
          const insertQuestStepRewardParams = [
            questStepReward.id,
            questStepReward.stepId,
            questStepReward.kamasRatio,
            questStepReward.experienceRatio,
            JSON.stringify(questStepReward.itemsReward),
            JSON.stringify(questStepReward.emotesReward),
            JSON.stringify(questStepReward.spellsReward),
            JSON.stringify(questStepReward.titlesReward),
          ];
          await pool.execute(
            insertQuestStepRewardQuery,
            insertQuestStepRewardParams
          );
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchQuestObjectivesAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 15448;
  let query = `CREATE TABLE IF NOT EXISTS quest_objectives (
        id INT,
        typeId INT,
        stepId INT,
        mapId INT,
        dialogId INT
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  await pool.execute(query);
  const insertQuestObjectiveQuery =
    "INSERT INTO quest_objectives (id, typeId, stepId, mapId, dialogId) VALUES (?, ?, ?, ?, ?)";
  try {
    while (true) {
      await delay(400);
      const responseQuestObjectives = await axios.get(
        `https://api.beta.dofusdb.fr/quest-objectives?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const questObjectives = responseQuestObjectives.data.data;

      if (questObjectives.length === 0) {
        console.log("Ended quest objectives fetching.");
        break;
      }
      for (const questObjective of questObjectives) {
        try {
          const insertQuestObjectiveParams = [
            questObjective.id,
            questObjective.typeId,
            questObjective.stepId,
            questObjective.mapId,
            questObjective.dialogId,
          ];
          await pool.execute(
            insertQuestObjectiveQuery,
            insertQuestObjectiveParams
          );
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchQuestObjectiveTypesAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS quest_objective_types (
        id INT,
        name VARCHAR(256)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  await pool.execute(query);
  const insertQuestObjectiveTypeQuery =
    "INSERT INTO quest_objective_types (id, name) VALUES (?, ?)";
  try {
    while (true) {
      const responseQuestObjectiveTypes = await axios.get(
        `https://api.beta.dofusdb.fr/quest-objective-types?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const questObjectiveTypes = responseQuestObjectiveTypes.data.data;
      if (questObjectiveTypes.length === 0) {
        console.log("Ended quest objective types fetching.");
        break;
      }
      for (const questObjectiveType of questObjectiveTypes) {
        try {
          const insertQuestObjectiveTypeParams = [
            questObjectiveType.id,
            questObjectiveType.name.fr,
          ];
          await pool.execute(
            insertQuestObjectiveTypeQuery,
            insertQuestObjectiveTypeParams
          );
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchQuestCategoriesAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS quest_categories (
        id INT,
        name VARCHAR(100),
        \`order\` INT,
        questIds JSON
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  await pool.execute(query);
  const insertQuestCategoryQuery = `INSERT INTO quest_categories (id, name, \`order\`, questIds) VALUES (?, ?, ?, ?)`;
  try {
    while (true) {
      await delay(450);
      const responseQuestCategories = await axios.get(
        `https://api.beta.dofusdb.fr/quest-categories?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const questCategories = responseQuestCategories.data.data;
      if (questCategories.length === 0) {
        console.log("Ended quest categories fetching.");
        break;
      }
      for (const questCategory of questCategories) {
        try {
          const insertQuestCategoryParams = [
            questCategory.id,
            questCategory.name.fr,
            questCategory.order,
            JSON.stringify(questCategory.questIds),
          ];
          await pool.execute(
            insertQuestCategoryQuery,
            insertQuestCategoryParams
          );
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchAchievementsObjectivesAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS achievement_objectives (
        id INT,
        achievement_id INT,
        name VARCHAR(100),
        \`order\` INT,
        readableCriterions JSON
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;

  await pool.execute(query);

  skip += 50;

  const insertAchievementObjectiveQuery = `INSERT INTO achievement_objectives (id, achievement_id, name, \`order\`, readableCriterions) VALUES (?, ?, ?, ?, ? )`;

  try {
    while (true) {
      await delay(200);
      const responseAchievementsObjectives = await axios.get(
        `https://api.beta.dofusdb.fr/achievement-objectives?$limit=50&$skip=${skip}`
      );

      skip += 50;

      const achievementsObjectives = responseAchievementsObjectives.data.data;

      if (achievementsObjectives.length === 0) {
        console.log("Ended achievements objectives fetching.");
        break;
      }

      for (const achievementObjective of achievementsObjectives) {
        try {
          const insertAchievementObjectiveParams = [
            achievementObjective.id,
            achievementObjective.achievementId,
            achievementObjective.name.fr,
            achievementObjective.order,
            JSON.stringify(achievementObjective.readableCriterion),
          ];

          await pool.execute(
            insertAchievementObjectiveQuery,
            insertAchievementObjectiveParams
          );
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchAchievementsCategoriesAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS achievements_categories (
        id INT,
        name VARCHAR(100),
        parentId INT,
        parentName VARCHAR(100),
        img TEXT,
        color VARCHAR(12),
        achievementIds JSON
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;

  await pool.execute(query);

  const insertAchievementCategoryQuery = `INSERT INTO achievements_categories (id, name, parentId, parentName, img, color, achievementIds) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  try {
    while (true) {
      const responseAchievementsCategories = await axios.get(
        `https://api.beta.dofusdb.fr/achievement-categories?$limit=50&$skip=${skip}`
      );
      skip += 50;

      const achievementsCategories = responseAchievementsCategories.data.data;

      if (achievementsCategories.length === 0) {
        console.log("Ended achievements categories fetching.");
        break;
      }

      for (const achievementCategory of achievementsCategories) {
        try {
          const insertAchievementCategoryParams = [
            achievementCategory.id,
            achievementCategory.name.fr,
            achievementCategory.parentId,
            achievementCategory.icon,
            achievementCategory.color,
            JSON.stringify(achievementCategory.achievementIds),
          ];

          await pool.execute(
            insertAchievementCategoryQuery,
            insertAchievementCategoryParams
          );
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchAchievementsRewardsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS achievements_rewards (
        id INT,
        achievement_id INT,
        kamasRatio INT,
        experienceRatio INT,
        itemsReward JSON,
        emotesReward JSON,
        spellsReward JSON,
        titlesReward JSON,
        ornamentsReward JSON
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;

  await pool.execute(query);

  const insertAchievementRewardQuery = `INSERT INTO achievements_rewards (id, achievement_id, kamasRatio, experienceRatio, itemsReward, emotesReward, spellsReward, titlesReward, ornamentsReward) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    while (true) {
      const responseAchievementsRewards = await axios.get(
        `https://api.beta.dofusdb.fr/achievement-rewards?$limit=50&$skip=${skip}`
      );

      skip += 50;

      const achievementsRewards = responseAchievementsRewards.data.data;

      if (achievementsRewards.length === 0) {
        console.log("Ended achievements rewards fetching.");
        break;
      }

      for (const achievementReward of achievementsRewards) {
        try {
          const insertAchievementRewardParams = [
            achievementReward.id,
            achievementReward.achievementId,
            achievementReward.kamasRatio,
            achievementReward.experienceRatio,
            JSON.stringify(achievementReward.itemsReward),
            JSON.stringify(achievementReward.emotesReward),
            JSON.stringify(achievementReward.spellsReward),
            JSON.stringify(achievementReward.titlesReward),
            JSON.stringify(achievementReward.ornamentsReward),
          ];

          await pool.execute(
            insertAchievementRewardQuery,
            insertAchievementRewardParams
          );
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchAchievementsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS achievements (
    id INT,
    name VARCHAR(100),
    description TEXT,
    category_id INT,
    points INT,
    level INT,
    img TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  await pool.execute(query);
  const insertAchievementQuery =
    "INSERT INTO achievements (id, name, description, category_id, points, level, img) VALUES (?, ?, ?, ?, ?, ?, ?)";
  try {
    while (true) {
      await delay(200);
      const responseAchievements = await axios.get(
        `https://api.beta.dofusdb.fr/achievements?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const achievements = responseAchievements.data.data;

      if (achievements.length === 0) {
        console.log("Ended achievements fetching.");
        break;
      }

      for (const achievement of achievements) {
        try {
          const insertAchievementParams = [
            achievement.id,
            achievement.name.fr,
            achievement.description.fr,
            achievement.categoryId,
            achievement.points,
            achievement.level,
            achievement.img,
          ];
          await pool.execute(insertAchievementQuery, insertAchievementParams);
        } catch (error) {
          console.error("Error inserting item:", error);
        }
      }
    }
  } catch {
    console.error("error in achievements");
  }
}
async function fetchItemsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let insertItemParams;
  let effect = {};
  let query = `CREATE TABLE IF NOT EXISTS items (
        name VARCHAR(100),
        description text,
        level INT,
        img VARCHAR(100),
        imgHighRes VARCHAR(100),
        id INT,
        apCost INT,
        maxRange INT,
        minRange INT,
        nmbCast INT,
        criticalHitProbability INT,
        weaponDmgFrom INT,
        weaponDmgTo INT,
        itemCharacteristics INT,
        type VARCHAR(50),
        setName VARCHAR(100),
        setId INT,
        effectId INT
    );`;
  await pool.execute(query);
  const insertItemQuery =
    "INSERT INTO items (name, description, level, img, imgHighRes, id, apCost, maxRange, minRange, nmbCast, criticalHitProbability, weaponDmgFrom, weaponDmgTo, itemCharacteristics, type, setName, setId, effectId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    while (true) {
      await delay(350);
      const responseItems = await axios.get(
        `https://api.beta.dofusdb.fr/items?$limit=150&$skip=${skip}`
      );
      skip += 50;
      const items = responseItems.data.data;

      if (items.length === 0) {
        console.log("Ended items fetching.");
        break;
      }

      for (const item of items) {
        try {
          if (item.effects.length == 0) {
            insertItemParams = [
              item.name.fr,
              item.description.fr,
              item.level,
              item.imgset[0].url,
              item.imgset[2].url,
              item.id,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              item.type.name.fr,
              null,
              null,
              null,
            ];
            await pool.execute(insertItemQuery, insertItemParams);
          } else {
            for (let i = 0; i < item.effects.length; i++) {
              try {
                if (item.itemSet == null) {
                  insertItemParams = [
                    item.name.fr,
                    item.description.fr,
                    item.level,
                    item.imgset[0].url,
                    item.imgset[2].url,
                    item.id,
                    item.apCost || null,
                    item.range || null,
                    item.minRange || null,
                    item.maxCastPerTurn || null,
                    item.criticalHitProbability || null,
                    item.effects[i].from || null,
                    item.effects[i].to || null,
                    item.effects[i].characteristic || null,
                    item.type.name.fr,
                    null,
                    null,
                    item.possibleEffects[i].effectId || null || undefined,
                  ];
                } else {
                  insertItemParams = [
                    item.name.fr,
                    item.description.fr,
                    item.level,
                    item.imgset[0].url,
                    item.imgset[2].url,
                    item.id,
                    item.apCost || null,
                    item.range || null,
                    item.minRange || null,
                    item.maxCastPerTurn || null,
                    item.criticalHitProbability || null,
                    item.effects[i].from || null,
                    item.effects[i].to || null,
                    item.effects[i].characteristic || null,
                    item.type.name.fr,
                    item.itemSet.name.fr || null,
                    item.itemSet.name.id || null,
                    item.possibleEffects[i].effectId || null || undefined,
                  ];
                }
                await pool.execute(insertItemQuery, insertItemParams);
              } catch (error) {
                // console.error('error in itemInsertParams ', error);
              }
            }
          }
        } catch (error) {
          // console.log('error in item loop ', error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

async function fetchCharacteristicsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS characteristics (
        characteristic_id int NOT NULL,
        name varchar(100) NOT NULL,
        img_url varchar(100) NOT NULL
    );`;
  await pool.execute(query);
  const insertCharacteristicQuery =
    "INSERT INTO characteristics (characteristic_id, name, img_url) VALUES (?, ?, ?)";

  try {
    while (true) {
      await delay(200);
      const responseCharacteristics = await axios.get(
        `https://api.beta.dofusdb.fr/characteristics?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const characteristics = responseCharacteristics.data.data;

      if (characteristics.length === 0) {
        console.log("Ended characteristics fetching.");
        break;
      }

      for (const characteristic of characteristics) {
        try {
          const insertCharacteristicParams = [
            characteristic.id,
            characteristic.name.fr,
            `https://dofusdb.fr/icons/characteristics/${characteristic.asset}.png`,
          ];
          await pool.execute(
            insertCharacteristicQuery,
            insertCharacteristicParams
          );
        } catch (error) {
          // console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    // console.log(error);
  }
}

async function fetchEffectsAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS effects (
        id int NOT NULL,
        description text NOT NULL,
        characteristic int NOT NULL
    );`;
  await pool.execute(query);
  const insertEffectQuery =
    "INSERT INTO effects (id, description, characteristic) VALUES (?, ?, ?)";

  try {
    while (true) {
      await delay(200);
      const responseEffects = await axios.get(
        `https://api.beta.dofusdb.fr/effects?$limit=50&$skip=${skip}`
      );
      skip += 50;
      const effects = responseEffects.data.data;

      if (effects.length === 0) {
        console.log("Ended effects fetching.");
        break;
      }

      for (const effect of effects) {
        try {
          const insertEffectParams = [
            effect.id,
            effect.description.fr || undefined,
            effect.characteristic,
          ];
          await pool.execute(insertEffectQuery, insertEffectParams);
        } catch (error) {
          // console.error("Error inserting item:", error);
        }
      }
    }
  } catch (error) {
    // console.log(error);
  }
}

async function fetchRecipesAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let ingredients: String[] = [];
  let quantities: String[] = [];
  let query = `CREATE TABLE IF NOT EXISTS recipes (
        resultId INT NOT NULL,
        quantities INT NOT NULL,
        ids INT NOT NULL,
        jobId INT NOT NULL
    );`;
  await pool.execute(query);
  const insertRecipesQuery =
    "INSERT INTO recipes (resultId, quantities, ids, jobId) VALUES(?, ?, ?, ?)";

  try {
    while (true) {
      await delay(350);
      const responseRecipes = await axios.get(
        `https://api.beta.dofusdb.fr/recipes?$limit=50&$skip=${skip}`
      );
      skip += 50;
      let recipes = responseRecipes.data.data;

      if (recipes.length == 0) {
        console.log("Ended recipes fetching.");
        break;
      }

      for (const recipe of recipes) {
        recipe.quantities.forEach((quantity: Number) => {
          quantities.push(quantity.toString());
        });
        recipe.ingredientIds.forEach((ingredient: Number) => {
          ingredients.push(ingredient.toString());
        });
        for (let i = 0; i < ingredients.length; i++) {
          const insertRecipesParams = [
            recipe.resultId,
            quantities[i],
            ingredients[i],
            recipe.jobId,
          ];
          await pool.execute(insertRecipesQuery, insertRecipesParams);
        }
        ingredients = [];
        quantities = [];
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchJobsAndInsertIntoDB(pool: mysql.Pool) {
  let query = `CREATE TABLE IF NOT EXISTS jobs (
        jobId int,
        jobName varchar(50)
    );`;
  await pool.execute(query);
  const insertJobsQuery = "INSERT INTO jobs (jobId, jobName) VALUES(?, ?)";

  try {
    while (true) {
      await delay(200);
      const jobsResponse = await axios.get(
        `https://api.beta.dofusdb.fr/jobs?$limit=22`
      );
      let jobs = jobsResponse.data.data;

      for (const job of jobs) {
        const insertJobsParams = [job.id, job.name.fr];
        await pool.execute(insertJobsQuery, insertJobsParams);
      }
      console.log("Ended jobs fetching.");
      break;
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchItemSetsAndInsertIntoDB(pool: mysql.Pool) {
  let query = `CREATE TABLE IF NOT EXISTS itemSets (
        setName VARCHAR(100),
        setId INT,
        numberItem INT,
        charac INT,
        characValue INT,
        setLevel INT
    );`;
  await pool.execute(query);
  let skip = 0;
  const insertJobsQuery =
    "INSERT INTO itemSets (setName, setId, numberItem, charac, characValue, setLevel) VALUES(?, ?, ?, ?, ?, ?)";

  try {
    while (true) {
      await delay(400);
      const itemSetsResponse = await axios.get(
        `https://api.beta.dofusdb.fr/item-sets?$limit=50&$skip=${skip}`
      );
      skip += 50;
      let itemSets = itemSetsResponse.data.data;

      if (itemSets.length == 0) {
        console.log("Ended itemSets fetching.");
        break;
      }

      for (const itemSet of itemSets) {
        for (let i = 0; i < itemSet.effects.length; i++) {
          for (const itemEffect of itemSet.effects[i]) {
            const insertJobsParams = [
              itemSet.name.fr,
              itemSet.name.id,
              i + 1,
              itemEffect.characteristic || null,
              itemEffect.from || null,
              itemSet.items[0].level,
            ];
            await pool.execute(insertJobsQuery, insertJobsParams);
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchItemsTypeAndInsertIntoDB(pool: mysql.Pool) {
  let skip = 0;
  let query = `CREATE TABLE IF NOT EXISTS itemsType (
        name varchar(100),
        id int
    )`;
  await pool.execute(query);
  const insertIntoItemTypeQuery =
    "INSERT INTO itemsType (name, id) VALUES(?, ?)";

  try {
    while (true) {
      await delay(200);
      const response = await axios.get(
        `https://api.beta.dofusdb.fr/item-types?$limit=50&$skip=${skip}`
      );
      skip += 50;
      let itemsType = response.data.data;

      if (itemsType.length == 0) {
        console.log("Ended fetching items types.");
        break;
      }

      for (const itemType of itemsType) {
        try {
          const insertItemsTypeParams = [itemType.name.fr, itemType.id];
          await pool.execute(insertIntoItemTypeQuery, insertItemsTypeParams);
        } catch (error) {
          console.error(`error inserting itemtype ${error}`);
        }
      }
    }
  } catch (error) {
    console.error(`error fetching items-type: ${error}`);
  }
}

async function fetchMobsAndInsertIntoDB(pool: mysql.Pool) {
  let query = `CREATE TABLE IF NOT EXISTS mobs (
        name VARCHAR(100),
        id INT,
        level INT,
        img TEXT,
        lifePoints INT,
        actionPoints INT,
        mouvementPoints INT,
        vitality INT,
        paDodge INT,
        pmDodge INT,
        wisdom INT,
        earthResistance INT,
        airResistance INT,
        fireResistance INT,
        waterResistance INT,
        neutralResistance INT,
        strength INT,
        intelligence INT,
        chance INT,
        agility INT
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  pool.execute(query);

  const insertMobsQuery =
    "INSERT INTO mobs (name, id, level, img, lifePoints, actionPoints, mouvementPoints, vitality, paDodge, pmDodge, wisdom, earthResistance, airResistance, fireResistance, waterResistance, neutralResistance, strength, intelligence, chance, agility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    await delay(450);
    let skip = 0;
    while (true) {
      const mobsResponse = await axios.get(
        `https://api.beta.dofusdb.fr/monsters?$limit=50&$skip=${skip}`
      );
      skip += 50;
      let mobs = mobsResponse.data.data;

      if (mobs.length == 0) {
        console.log("Ended mobs fetching.");
        return;
      }
      for (const mob of mobs) {
        for (const grade of mob.grades) {
          try {
            const insertMobsParams = [
              mob.name.fr,
              mob.id,
              grade.level,
              mob.img,
              grade.lifePoints,
              grade.actionPoints,
              grade.movementPoints,
              grade.vitality,
              grade.paDodge,
              grade.pmDodge,
              grade.wisdom,
              grade.earthResistance,
              grade.airResistance,
              grade.fireResistance,
              grade.waterResistance,
              grade.neutralResistance,
              grade.strength,
              grade.intelligence,
              grade.chance,
              grade.agility,
            ];
            await pool.execute(insertMobsQuery, insertMobsParams);
          } catch (error) {
            console.error(`error insterting into mobs${error}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`error in while true ${error}`);
  }
}

async function fetchSpellsAndInsertIntoDB(pool: mysql.Pool) {
  let query = `CREATE TABLE IF NOT EXISTS spells (
        spellName VARCHAR(100),
        spellId INT,
        mobId INT
    );`;
  pool.execute(query);
  try {
    while (true) {}
  } catch (error) {
    console.error(error);
  }
}

async function fetchMobsDropAndInsertIntoDB(pool: mysql.Pool) {
  let query = `CREATE TABLE IF NOT EXISTS mobsDrop (
        mobId INT,
        dropId INT,
        pourcentageDrop INT,
        criteria BOOLEAN
    );`;
  pool.execute(query);
  let skip = 0;
  const insertDropsQuery =
    "INSERT INTO mobsDrop (mobId, dropId, pourcentageDrop, criteria) VALUES (?, ?, ?, ?)";
  try {
    while (true) {
      const dropsReponse = await axios.get(
        `https://api.dofusdb.fr/monsters?$limit=50&$skip=${skip}`
      );
      skip += 50;
      let mobs = dropsReponse.data.data;

      if (mobs.length == 0) {
        console.log("Ended drops fetching.");
        return;
      }

      for (const mob of mobs) {
        try {
          for (const drop of mob.drops) {
            const insertDropsParams = [
              drop.monsterId,
              drop.objectId,
              drop.percentDropForGrade1,
              drop.hasCriteria,
            ];
            await pool.execute(insertDropsQuery, insertDropsParams);
          }
        } catch (error) {
          // console.log(`No drop${error}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  try {
    const pool = await mysql.createPool(dbConfig);

    console.log("fetching started");

    //DONE await fetchQuestsAndInsertIntoDB(pool);
    //DONE await fetchQuestStepsAndInsertIntoDB(pool);
    //DONE await fetchQuestStepRewardsAndInsertIntoDB(pool);
    //DONE await fetchQuestCategoriesAndInsertIntoDB(pool);
    //DONE await fetchQuestObjectiveTypesAndInsertIntoDB(pool);
    //DONE await fetchQuestObjectivesAndInsertIntoDB(pool);

    //DONE await fetchAchievementsObjectivesAndInsertIntoDB(pool);
    // await fetchAchievementsCategoriesAndInsertIntoDB(pool);
    //DONE await fetchAchievementsRewardsAndInsertIntoDB(pool);
    //DONE await fetchAchievementsAndInsertIntoDB(pool);

    //DONE await fetchCharacteristicsAndInsertIntoDB(pool);
    //DONE await fetchEffectsAndInsertIntoDB(pool);
    //DONE await fetchJobsAndInsertIntoDB(pool);

    //DONE await fetchItemSetsAndInsertIntoDB(pool);
    // await fetchItemsAndInsertIntoDB(pool);
    //DONE await fetchItemsTypeAndInsertIntoDB(pool);
    await fetchRecipesAndInsertIntoDB(pool);

    //DONE await fetchMobsAndInsertIntoDB(pool);
    //DONE await fetchMobsDropAndInsertIntoDB(pool);
    await pool.end();
  } catch (error) {
    console.log(error);
  }
}

main();
