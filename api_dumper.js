var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = require("dotenv").config().parsed;
var axios_1 = require("axios");
var mysql = require("mysql2/promise");
function fetchItemsAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var skip, insertItemParams, effect, query, insertItemQuery, responseItems, items, _i, items_1, item, i, error_1, error_2, error_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          skip = 0;
          effect = {};
          query = "CREATE TABLE IF NOT EXISTS items (\n        name VARCHAR(100),\n        description text,\n        level INT,\n        img VARCHAR(100),\n        imgHighRes VARCHAR(100),\n        id INT,\n        apCost INT,\n        maxRange INT,\n        minRange INT,\n        nmbCast INT,\n        criticalHitProbability INT,\n        weaponDmgFrom INT,\n        weaponDmgTo INT,\n        itemCharacteristics INT,\n        type VARCHAR(50),\n        setName VARCHAR(100),\n        setId INT,\n        effectId INT\n    );";
          return [4 /*yield*/, pool.execute(query)];
        case 1:
          _a.sent();
          insertItemQuery = "INSERT INTO items (name, description, level, img, imgHighRes, id, apCost, maxRange, minRange, nmbCast, criticalHitProbability, weaponDmgFrom, weaponDmgTo, itemCharacteristics, type, setName, setId, effectId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          _a.label = 2;
        case 2:
          _a.trys.push([2, 19, , 20]);
          _a.label = 3;
        case 3:
          if (!true) return [3 /*break*/, 18];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/items?$limit=150&$skip=".concat(skip))];
        case 4:
          responseItems = _a.sent();
          skip += 50;
          items = responseItems.data.data;
          if (items.length === 0) {
            console.log("No more items to fetch.");
            return [3 /*break*/, 18];
          }
          _i = 0, items_1 = items;
          _a.label = 5;
        case 5:
          if (!(_i < items_1.length)) return [3 /*break*/, 17];
          item = items_1[_i];
          _a.label = 6;
        case 6:
          _a.trys.push([6, 15, , 16]);
          if (!(item.effects.length == 0)) return [3 /*break*/, 8];
          insertItemParams = [item.name.fr, item.description.fr, item.level, item.imgset[0].url, item.imgset[2].url, item.id, null, null, null, null, null, null, null, null, item.type.name.fr, null, null, null];
          return [4 /*yield*/, pool.execute(insertItemQuery, insertItemParams)];
        case 7:
          _a.sent();
          return [3 /*break*/, 14];
        case 8:
          i = 0;
          _a.label = 9;
        case 9:
          if (!(i < item.effects.length)) return [3 /*break*/, 14];
          _a.label = 10;
        case 10:
          _a.trys.push([10, 12, , 13]);
          if (item.itemSet == null) {
            insertItemParams = [item.name.fr, item.description.fr, item.level, item.imgset[0].url, item.imgset[2].url, item.id, item.apCost || null, item.range || null, item.minRange || null, item.maxCastPerTurn || null, item.criticalHitProbability || null, item.effects[i].from || null, item.effects[i].to || null, item.effects[i].characteristic || null, item.type.name.fr, null, null, item.possibleEffects[i].effectId || null || undefined];
          }
          else {
            insertItemParams = [item.name.fr, item.description.fr, item.level, item.imgset[0].url, item.imgset[2].url, item.id, item.apCost || null, item.range || null, item.minRange || null, item.maxCastPerTurn || null, item.criticalHitProbability || null, item.effects[i].from || null, item.effects[i].to || null, item.effects[i].characteristic || null, item.type.name.fr, item.itemSet.name.fr || null, item.itemSet.name.id || null, item.possibleEffects[i].effectId || null || undefined];
          }
          return [4 /*yield*/, pool.execute(insertItemQuery, insertItemParams)];
        case 11:
          _a.sent();
          return [3 /*break*/, 13];
        case 12:
          error_1 = _a.sent();
          return [3 /*break*/, 13];
        case 13:
          i++;
          return [3 /*break*/, 9];
        case 14: return [3 /*break*/, 16];
        case 15:
          error_2 = _a.sent();
          console.log('error in item loop ', error_2);
          return [3 /*break*/, 16];
        case 16:
          _i++;
          return [3 /*break*/, 5];
        case 17: return [3 /*break*/, 3];
        case 18: return [3 /*break*/, 20];
        case 19:
          error_3 = _a.sent();
          console.error("Error fetching items:", error_3);
          return [3 /*break*/, 20];
        case 20: return [2 /*return*/];
      }
    });
  });
}
function fetchCharacteristicsAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var skip, query, insertCharacteristicQuery, responseCharacteristics, characteristics, _i, characteristics_1, characteristic, insertCharacteristicParams, error_4, error_5;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          skip = 0;
          query = "CREATE TABLE IF NOT EXISTS characteristics (\n        characteristic_id int NOT NULL,\n        name varchar(100) NOT NULL,\n        img_url varchar(100) NOT NULL\n    );";
          return [4 /*yield*/, pool.execute(query)];
        case 1:
          _a.sent();
          insertCharacteristicQuery = "INSERT INTO characteristics (characteristic_id, name, img_url) VALUES (?, ?, ?)";
          _a.label = 2;
        case 2:
          _a.trys.push([2, 12, , 13]);
          _a.label = 3;
        case 3:
          if (!true) return [3 /*break*/, 11];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/characteristics?$limit=50&$skip=".concat(skip))];
        case 4:
          responseCharacteristics = _a.sent();
          skip += 50;
          characteristics = responseCharacteristics.data.data;
          if (characteristics.length === 0) {
            console.log("No more characteristics to fetch.");
            return [3 /*break*/, 11];
          }
          _i = 0, characteristics_1 = characteristics;
          _a.label = 5;
        case 5:
          if (!(_i < characteristics_1.length)) return [3 /*break*/, 10];
          characteristic = characteristics_1[_i];
          _a.label = 6;
        case 6:
          _a.trys.push([6, 8, , 9]);
          insertCharacteristicParams = [characteristic.id, characteristic.name.fr, "https://dofusdb.fr/icons/characteristics/".concat(characteristic.asset, ".png")];
          return [4 /*yield*/, pool.execute(insertCharacteristicQuery, insertCharacteristicParams)];
        case 7:
          _a.sent();
          return [3 /*break*/, 9];
        case 8:
          error_4 = _a.sent();
          return [3 /*break*/, 9];
        case 9:
          _i++;
          return [3 /*break*/, 5];
        case 10: return [3 /*break*/, 3];
        case 11: return [3 /*break*/, 13];
        case 12:
          error_5 = _a.sent();
          return [3 /*break*/, 13];
        case 13: return [2 /*return*/];
      }
    });
  });
}
function fetchEffectsAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var skip, query, insertEffectQuery, responseEffects, effects, _i, effects_1, effect, insertEffectParams, error_6, error_7;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          skip = 0;
          query = "CREATE TABLE IF NOT EXISTS effects (\n        id int NOT NULL,\n        description text NOT NULL,\n        characteristic int NOT NULL\n    );";
          return [4 /*yield*/, pool.execute(query)];
        case 1:
          _a.sent();
          insertEffectQuery = "INSERT INTO effects (id, description, characteristic) VALUES (?, ?, ?)";
          _a.label = 2;
        case 2:
          _a.trys.push([2, 12, , 13]);
          _a.label = 3;
        case 3:
          if (!true) return [3 /*break*/, 11];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/effects?$limit=50&$skip=".concat(skip))];
        case 4:
          responseEffects = _a.sent();
          skip += 50;
          effects = responseEffects.data.data;
          if (effects.length === 0) {
            console.log("No more effects to fetch.");
            return [3 /*break*/, 11];
          }
          _i = 0, effects_1 = effects;
          _a.label = 5;
        case 5:
          if (!(_i < effects_1.length)) return [3 /*break*/, 10];
          effect = effects_1[_i];
          _a.label = 6;
        case 6:
          _a.trys.push([6, 8, , 9]);
          insertEffectParams = [effect.id, effect.description.fr || undefined, effect.characteristic];
          return [4 /*yield*/, pool.execute(insertEffectQuery, insertEffectParams)];
        case 7:
          _a.sent();
          return [3 /*break*/, 9];
        case 8:
          error_6 = _a.sent();
          return [3 /*break*/, 9];
        case 9:
          _i++;
          return [3 /*break*/, 5];
        case 10: return [3 /*break*/, 3];
        case 11: return [3 /*break*/, 13];
        case 12:
          error_7 = _a.sent();
          return [3 /*break*/, 13];
        case 13: return [2 /*return*/];
      }
    });
  });
}
function fetchRecipesAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var skip, ingredients, quantities, query, insertRecipesQuery, responseRecipes, recipes, _i, recipes_1, recipe, i, insertRecipesParams, error_8;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          skip = 0;
          ingredients = [];
          quantities = [];
          query = "CREATE TABLE IF NOT EXISTS recipes (\n        resultId INT NOT NULL,\n        quantities INT NOT NULL,\n        ids INT NOT NULL,\n        jobId INT NOT NULL\n    );";
          return [4 /*yield*/, pool.execute(query)];
        case 1:
          _a.sent();
          insertRecipesQuery = "INSERT INTO recipes (resultId, quantities, ids, jobId) VALUES(?, ?, ?, ?)";
          _a.label = 2;
        case 2:
          _a.trys.push([2, 13, , 14]);
          _a.label = 3;
        case 3:
          if (!true) return [3 /*break*/, 12];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/recipes?$limit=50&$skip=".concat(skip))];
        case 4:
          responseRecipes = _a.sent();
          skip += 50;
          recipes = responseRecipes.data.data;
          if (recipes.length == 0) {
            console.log("no more recipes to fetch.");
            return [3 /*break*/, 12];
          }
          _i = 0, recipes_1 = recipes;
          _a.label = 5;
        case 5:
          if (!(_i < recipes_1.length)) return [3 /*break*/, 11];
          recipe = recipes_1[_i];
          recipe.quantities.forEach(function (quantity) {
            quantities.push(quantity.toString());
          });
          recipe.ingredientIds.forEach(function (ingredient) {
            ingredients.push(ingredient.toString());
          });
          i = 0;
          _a.label = 6;
        case 6:
          if (!(i < ingredients.length)) return [3 /*break*/, 9];
          insertRecipesParams = [recipe.resultId, quantities[i], ingredients[i], recipe.jobId];
          return [4 /*yield*/, pool.execute(insertRecipesQuery, insertRecipesParams)];
        case 7:
          _a.sent();
          _a.label = 8;
        case 8:
          i++;
          return [3 /*break*/, 6];
        case 9:
          ingredients = [];
          quantities = [];
          _a.label = 10;
        case 10:
          _i++;
          return [3 /*break*/, 5];
        case 11:
          ;
          return [3 /*break*/, 3];
        case 12: return [3 /*break*/, 14];
        case 13:
          error_8 = _a.sent();
          console.error(error_8);
          return [3 /*break*/, 14];
        case 14: return [2 /*return*/];
      }
    });
  });
}
function fetchJobsAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var query, insertJobsQuery, jobsResponse, jobs, _i, jobs_1, job, insertJobsParams, error_9;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          query = "CREATE TABLE IF NOT EXISTS jobs (\n        jobId int,\n        jobName varchar(50)\n    );";
          return [4 /*yield*/, pool.execute(query)];
        case 1:
          _a.sent();
          insertJobsQuery = "INSERT INTO jobs (jobId, jobName) VALUES(?, ?)";
          _a.label = 2;
        case 2:
          _a.trys.push([2, 10, , 11]);
          _a.label = 3;
        case 3:
          if (!true) return [3 /*break*/, 9];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/jobs?$limit=22")];
        case 4:
          jobsResponse = _a.sent();
          jobs = jobsResponse.data.data;
          _i = 0, jobs_1 = jobs;
          _a.label = 5;
        case 5:
          if (!(_i < jobs_1.length)) return [3 /*break*/, 8];
          job = jobs_1[_i];
          insertJobsParams = [job.id, job.name.fr];
          return [4 /*yield*/, pool.execute(insertJobsQuery, insertJobsParams)];
        case 6:
          _a.sent();
          _a.label = 7;
        case 7:
          _i++;
          return [3 /*break*/, 5];
        case 8:
          console.log('no more jobs to fetch');
          return [3 /*break*/, 9];
        case 9: return [3 /*break*/, 11];
        case 10:
          error_9 = _a.sent();
          console.error(error_9);
          return [3 /*break*/, 11];
        case 11: return [2 /*return*/];
      }
    });
  });
}
function fetchItemSetsAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var query, skip, insertJobsQuery, itemSetsResponse, itemSets, _i, itemSets_1, itemSet, i, _a, _b, itemEffect, insertJobsParams, error_10;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          query = "CREATE TABLE IF NOT EXISTS itemSets (\n        setName VARCHAR(100),\n        setId INT,\n        numberItem INT,\n        charac INT,\n        characValue INT,\n        setLevel INT\n    );";
          return [4 /*yield*/, pool.execute(query)];
        case 1:
          _c.sent();
          skip = 0;
          insertJobsQuery = "INSERT INTO itemSets (setName, setId, numberItem, charac, characValue, setLevel) VALUES(?, ?, ?, ?, ?, ?)";
          _c.label = 2;
        case 2:
          _c.trys.push([2, 14, , 15]);
          _c.label = 3;
        case 3:
          if (!true) return [3 /*break*/, 13];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/item-sets?$limit=50&$skip=".concat(skip))];
        case 4:
          itemSetsResponse = _c.sent();
          skip += 50;
          itemSets = itemSetsResponse.data.data;
          if (itemSets.length == 0) {
            console.log("finished fetching itemSets.");
            return [3 /*break*/, 13];
          }
          _i = 0, itemSets_1 = itemSets;
          _c.label = 5;
        case 5:
          if (!(_i < itemSets_1.length)) return [3 /*break*/, 12];
          itemSet = itemSets_1[_i];
          i = 0;
          _c.label = 6;
        case 6:
          if (!(i < itemSet.effects.length)) return [3 /*break*/, 11];
          _a = 0, _b = itemSet.effects[i];
          _c.label = 7;
        case 7:
          if (!(_a < _b.length)) return [3 /*break*/, 10];
          itemEffect = _b[_a];
          insertJobsParams = [itemSet.name.fr, itemSet.name.id, i + 1, itemEffect.characteristic || null, itemEffect.from || null, itemSet.items[0].level];
          return [4 /*yield*/, pool.execute(insertJobsQuery, insertJobsParams)];
        case 8:
          _c.sent();
          _c.label = 9;
        case 9:
          _a++;
          return [3 /*break*/, 7];
        case 10:
          i++;
          return [3 /*break*/, 6];
        case 11:
          _i++;
          return [3 /*break*/, 5];
        case 12: return [3 /*break*/, 3];
        case 13: return [3 /*break*/, 15];
        case 14:
          error_10 = _c.sent();
          console.error(error_10);
          return [3 /*break*/, 15];
        case 15: return [2 /*return*/];
      }
    });
  });
}
function fetchItemsTypeAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var skip, query, insertIntoItemTypeQuery, response, itemsType, _i, itemsType_1, itemType, insertItemsTypeParams, error_11, error_12;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          skip = 0;
          query = "CREATE TABLE IF NOT EXISTS itemsType (\n        name varchar(100),\n        id int\n    )";
          return [4 /*yield*/, pool.execute(query)];
        case 1:
          _a.sent();
          insertIntoItemTypeQuery = "INSERT INTO itemsType (name, id) VALUES(?, ?)";
          _a.label = 2;
        case 2:
          _a.trys.push([2, 12, , 13]);
          _a.label = 3;
        case 3:
          if (!true) return [3 /*break*/, 11];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/item-types?$limit=50&$skip=".concat(skip))];
        case 4:
          response = _a.sent();
          skip += 50;
          itemsType = response.data.data;
          if (itemsType.length == 0) {
            console.log('Finished fetching items type.');
            return [3 /*break*/, 11];
          }
          _i = 0, itemsType_1 = itemsType;
          _a.label = 5;
        case 5:
          if (!(_i < itemsType_1.length)) return [3 /*break*/, 10];
          itemType = itemsType_1[_i];
          _a.label = 6;
        case 6:
          _a.trys.push([6, 8, , 9]);
          insertItemsTypeParams = [itemType.name.fr, itemType.id];
          return [4 /*yield*/, pool.execute(insertIntoItemTypeQuery, insertItemsTypeParams)];
        case 7:
          _a.sent();
          return [3 /*break*/, 9];
        case 8:
          error_11 = _a.sent();
          console.error("error inserting itemtype ".concat(error_11));
          return [3 /*break*/, 9];
        case 9:
          _i++;
          return [3 /*break*/, 5];
        case 10: return [3 /*break*/, 3];
        case 11: return [3 /*break*/, 13];
        case 12:
          error_12 = _a.sent();
          console.error("error fetching items-type: ".concat(error_12));
          return [3 /*break*/, 13];
        case 13: return [2 /*return*/];
      }
    });
  });
}
function fetchMobsAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var query, insertMobsQuery, skip, mobsResponse, mobs, _i, mobs_1, mob, _a, _b, grade, insertMobsParams, error_13, error_14;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          query = "CREATE TABLE IF NOT EXISTS mobs (\n        name VARCHAR(100),\n        id INT,\n        level INT,\n        img TEXT,\n        lifePoints INT,\n        actionPoints INT,\n        mouvementPoints INT,\n        vitality INT,\n        paDodge INT,\n        pmDodge INT,\n        wisdom INT,\n        earthResistance INT,\n        airResistance INT,\n        fireResistance INT,\n        waterResistance INT,\n        neutralResistance INT,\n        strength INT,\n        intelligence INT,\n        chance INT,\n        agility INT\n    );";
          pool.execute(query);
          insertMobsQuery = "INSERT INTO mobs (name, id, level, img, lifePoints, actionPoints, mouvementPoints, vitality, paDodge, pmDodge, wisdom, earthResistance, airResistance, fireResistance, waterResistance, neutralResistance, strength, intelligence, chance, agility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          _c.label = 1;
        case 1:
          _c.trys.push([1, 13, , 14]);
          skip = 0;
          _c.label = 2;
        case 2:
          if (!true) return [3 /*break*/, 12];
          return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/monsters?$limit=50&$skip=".concat(skip))];
        case 3:
          mobsResponse = _c.sent();
          skip += 50;
          mobs = mobsResponse.data.data;
          if (mobs.length == 0) {
            console.log('finished fetching mobs.');
            return [2 /*return*/];
          }
          _i = 0, mobs_1 = mobs;
          _c.label = 4;
        case 4:
          if (!(_i < mobs_1.length)) return [3 /*break*/, 11];
          mob = mobs_1[_i];
          _a = 0, _b = mob.grades;
          _c.label = 5;
        case 5:
          if (!(_a < _b.length)) return [3 /*break*/, 10];
          grade = _b[_a];
          _c.label = 6;
        case 6:
          _c.trys.push([6, 8, , 9]);
          insertMobsParams = [mob.name.fr, mob.id, grade.level, mob.img, grade.lifePoints, grade.actionPoints, grade.movementPoints, grade.vitality, grade.paDodge, grade.pmDodge, grade.wisdom, grade.earthResistance, grade.airResistance, grade.fireResistance, grade.waterResistance, grade.neutralResistance, grade.strength, grade.intelligence, grade.chance, grade.agility];
          return [4 /*yield*/, pool.execute(insertMobsQuery, insertMobsParams)];
        case 7:
          _c.sent();
          return [3 /*break*/, 9];
        case 8:
          error_13 = _c.sent();
          console.error("error insterting into mobs".concat(error_13));
          return [3 /*break*/, 9];
        case 9:
          _a++;
          return [3 /*break*/, 5];
        case 10:
          _i++;
          return [3 /*break*/, 4];
        case 11:
          ;
          return [3 /*break*/, 2];
        case 12: return [3 /*break*/, 14];
        case 13:
          error_14 = _c.sent();
          console.error("error in while true ".concat(error_14));
          return [3 /*break*/, 14];
        case 14: return [2 /*return*/];
      }
    });
  });
}
function fetchSpellsAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var query;
    return __generator(this, function (_a) {
      query = "CREATE TABLE IF NOT EXISTS spells (\n        spellName VARCHAR(100),\n        spellId INT,\n        mobId INT\n    );";
      pool.execute(query);
      try {
        while (true) {
        }
      }
      catch (error) {
        console.error(error);
      }
      return [2 /*return*/];
    });
  });
}
function fetchMobsDropAndInsertIntoDB(pool) {
  return __awaiter(this, void 0, void 0, function () {
    var query, skip, insertDropsQuery, dropsReponse, mobs, _i, mobs_2, mob, _a, _b, drop, insertDropsParams, error_15, error_16;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          query = "CREATE TABLE IF NOT EXISTS mobsDrop (\n        mobId INT,\n        dropId INT,\n        pourcentageDrop INT,\n        criteria BOOLEAN\n    );";
          pool.execute(query);
          skip = 0;
          insertDropsQuery = "INSERT INTO mobsDrop (mobId, dropId, pourcentageDrop, criteria) VALUES (?, ?, ?, ?)";
          _c.label = 1;
        case 1:
          _c.trys.push([1, 14, , 15]);
          _c.label = 2;
        case 2:
          if (!true) return [3 /*break*/, 13];
          return [4 /*yield*/, axios_1.default.get("https://api.dofusdb.fr/monsters?$limit=50&$skip=".concat(skip))];
        case 3:
          dropsReponse = _c.sent();
          skip += 50;
          mobs = dropsReponse.data.data;
          if (mobs.length == 0) {
            console.log('finished fetching drops.');
            return [2 /*return*/];
          }
          _i = 0, mobs_2 = mobs;
          _c.label = 4;
        case 4:
          if (!(_i < mobs_2.length)) return [3 /*break*/, 12];
          mob = mobs_2[_i];
          _c.label = 5;
        case 5:
          _c.trys.push([5, 10, , 11]);
          _a = 0, _b = mob.drops;
          _c.label = 6;
        case 6:
          if (!(_a < _b.length)) return [3 /*break*/, 9];
          drop = _b[_a];
          insertDropsParams = [drop.monsterId, drop.objectId, drop.percentDropForGrade1, drop.hasCriteria];
          return [4 /*yield*/, pool.execute(insertDropsQuery, insertDropsParams)];
        case 7:
          _c.sent();
          _c.label = 8;
        case 8:
          _a++;
          return [3 /*break*/, 6];
        case 9: return [3 /*break*/, 11];
        case 10:
          error_15 = _c.sent();
          return [3 /*break*/, 11];
        case 11:
          _i++;
          return [3 /*break*/, 4];
        case 12: return [3 /*break*/, 2];
        case 13: return [3 /*break*/, 15];
        case 14:
          error_16 = _c.sent();
          console.error(error_16);
          return [3 /*break*/, 15];
        case 15: return [2 /*return*/];
      }
    });
  });
}
function main() {
  return __awaiter(this, void 0, void 0, function () {
    var pool, error_17;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 12, , 13]);
          return [4 /*yield*/, mysql.createPool(env.DB_URL)];
        case 1:
          pool = _a.sent();
          return [4 /*yield*/, fetchCharacteristicsAndInsertIntoDB(pool)];
        case 2:
          _a.sent();
          return [4 /*yield*/, fetchEffectsAndInsertIntoDB(pool)];
        case 3:
          _a.sent();
          return [4 /*yield*/, fetchRecipesAndInsertIntoDB(pool)];
        case 4:
          _a.sent();
          return [4 /*yield*/, fetchJobsAndInsertIntoDB(pool)];
        case 5:
          _a.sent();
          return [4 /*yield*/, fetchItemSetsAndInsertIntoDB(pool)];
        case 6:
          _a.sent();
          return [4 /*yield*/, fetchItemsAndInsertIntoDB(pool)];
        case 7:
          _a.sent();
          return [4 /*yield*/, fetchMobsAndInsertIntoDB(pool)];
        case 8:
          _a.sent();
          return [4 /*yield*/, fetchItemsTypeAndInsertIntoDB(pool)];
        case 9:
          _a.sent();
          return [4 /*yield*/, fetchMobsDropAndInsertIntoDB(pool)];
        case 10:
          _a.sent();
          return [4 /*yield*/, pool.end()];
        case 11:
          _a.sent();
          return [3 /*break*/, 13];
        case 12:
          error_17 = _a.sent();
          console.log(error_17);
          return [3 /*break*/, 13];
        case 13: return [2 /*return*/];
      }
    });
  });
}
main();
