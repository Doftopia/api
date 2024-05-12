"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var axios_1 = require("axios");
var mysql = require("mysql2/promise");
var dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "doftopia_api",
};
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function fetchQuestsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertQuestQuery, responseQuests, quests, _i, quests_1, quest, insertQuestParams, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = "CREATE TABLE IF NOT EXISTS quests (\n        id INT,\n        name VARCHAR(250),\n        stepIds JSON,\n        levelMin INT,\n        categoryId INT\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertQuestQuery = "INSERT INTO quests (id, name, stepIds, levelMin, categoryId) VALUES (?, ?, ?, ?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 11];
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/quests?$limit=50&$skip=".concat(skip))];
                case 4:
                    responseQuests = _a.sent();
                    skip += 50;
                    quests = responseQuests.data.data;
                    if (quests.length === 0) {
                        console.log("Ended quests fetching.");
                        return [3 /*break*/, 11];
                    }
                    _i = 0, quests_1 = quests;
                    _a.label = 5;
                case 5:
                    if (!(_i < quests_1.length)) return [3 /*break*/, 10];
                    quest = quests_1[_i];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    insertQuestParams = [
                        quest.id,
                        quest.name.fr,
                        quest.stepIds,
                        quest.levelMin,
                        quest.categoryId,
                    ];
                    return [4 /*yield*/, pool.execute(insertQuestQuery, insertQuestParams)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error("Error inserting item:", error_1);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 3];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function fetchQuestStepsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertQuestStepQuery, responseQuestSteps, questSteps, _i, questSteps_1, questStep, insertQuestStepParams, error_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 2189;
                    query = "CREATE TABLE IF NOT EXISTS quest_steps (\n        id INT,\n        questId INT,\n        name VARCHAR(100),\n        description TEXT,\n        dialogId INT,\n        optimalLevel INT,\n        objectiveIds  JSON\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertQuestStepQuery = "INSERT INTO quest_steps (id, questId, name, description, dialogId, optimalLevel, objectiveIds) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(500)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/quest-steps?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseQuestSteps = _a.sent();
                    skip += 50;
                    questSteps = responseQuestSteps.data.data;
                    if (questSteps.length === 0) {
                        console.log("Ended quest steps fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, questSteps_1 = questSteps;
                    _a.label = 6;
                case 6:
                    if (!(_i < questSteps_1.length)) return [3 /*break*/, 11];
                    questStep = questSteps_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertQuestStepParams = [
                        questStep.id,
                        questStep.questId,
                        questStep.name.fr,
                        questStep.description.fr,
                        questStep.dialogId,
                        questStep.optimalLevel,
                        JSON.stringify(questStep.objectiveIds),
                    ];
                    return [4 /*yield*/, pool.execute(insertQuestStepQuery, insertQuestStepParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_3 = _a.sent();
                    console.error("Error inserting item:", error_3);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchQuestStepRewardsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertQuestStepRewardQuery, responseQuestStepRewards, questStepRewards, _i, questStepRewards_1, questStepReward, insertQuestStepRewardParams, error_5, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 2600;
                    query = "CREATE TABLE IF NOT EXISTS quest_step_rewards (\n        id INT,\n        stepId INT,\n        kamasRatio INT,\n        experienceRatio INT,\n        itemsReward JSON,\n        emotesReward JSON,\n        spellsReward JSON,\n        titlesReward JSON\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertQuestStepRewardQuery = "INSERT INTO quest_step_rewards (id, stepId, kamasRatio, experienceRatio, itemsReward, emotesReward, spellsReward, titlesReward) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(450)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/quest-step-rewards?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseQuestStepRewards = _a.sent();
                    skip += 50;
                    questStepRewards = responseQuestStepRewards.data.data;
                    if (questStepRewards.length === 0) {
                        console.log("Ended quest step rewards fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, questStepRewards_1 = questStepRewards;
                    _a.label = 6;
                case 6:
                    if (!(_i < questStepRewards_1.length)) return [3 /*break*/, 11];
                    questStepReward = questStepRewards_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertQuestStepRewardParams = [
                        questStepReward.id,
                        questStepReward.stepId,
                        questStepReward.kamasRatio,
                        questStepReward.experienceRatio,
                        JSON.stringify(questStepReward.itemsReward),
                        JSON.stringify(questStepReward.emotesReward),
                        JSON.stringify(questStepReward.spellsReward),
                        JSON.stringify(questStepReward.titlesReward),
                    ];
                    return [4 /*yield*/, pool.execute(insertQuestStepRewardQuery, insertQuestStepRewardParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_5 = _a.sent();
                    console.error("Error inserting item:", error_5);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_6 = _a.sent();
                    console.error(error_6);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchQuestObjectivesAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertQuestObjectiveQuery, responseQuestObjectives, questObjectives, _i, questObjectives_1, questObjective, insertQuestObjectiveParams, error_7, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 15448;
                    query = "CREATE TABLE IF NOT EXISTS quest_objectives (\n        id INT,\n        typeId INT,\n        stepId INT,\n        mapId INT,\n        dialogId INT\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertQuestObjectiveQuery = "INSERT INTO quest_objectives (id, typeId, stepId, mapId, dialogId) VALUES (?, ?, ?, ?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(400)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/quest-objectives?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseQuestObjectives = _a.sent();
                    skip += 50;
                    questObjectives = responseQuestObjectives.data.data;
                    if (questObjectives.length === 0) {
                        console.log("Ended quest objectives fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, questObjectives_1 = questObjectives;
                    _a.label = 6;
                case 6:
                    if (!(_i < questObjectives_1.length)) return [3 /*break*/, 11];
                    questObjective = questObjectives_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertQuestObjectiveParams = [
                        questObjective.id,
                        questObjective.typeId,
                        questObjective.stepId,
                        questObjective.mapId,
                        questObjective.dialogId,
                    ];
                    return [4 /*yield*/, pool.execute(insertQuestObjectiveQuery, insertQuestObjectiveParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_7 = _a.sent();
                    console.error("Error inserting item:", error_7);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
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
function fetchQuestObjectiveTypesAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertQuestObjectiveTypeQuery, responseQuestObjectiveTypes, questObjectiveTypes, _i, questObjectiveTypes_1, questObjectiveType, insertQuestObjectiveTypeParams, error_9, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = "CREATE TABLE IF NOT EXISTS quest_objective_types (\n        id INT,\n        name VARCHAR(256)\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertQuestObjectiveTypeQuery = "INSERT INTO quest_objective_types (id, name) VALUES (?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 11];
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/quest-objective-types?$limit=50&$skip=".concat(skip))];
                case 4:
                    responseQuestObjectiveTypes = _a.sent();
                    skip += 50;
                    questObjectiveTypes = responseQuestObjectiveTypes.data.data;
                    if (questObjectiveTypes.length === 0) {
                        console.log("Ended quest objective types fetching.");
                        return [3 /*break*/, 11];
                    }
                    _i = 0, questObjectiveTypes_1 = questObjectiveTypes;
                    _a.label = 5;
                case 5:
                    if (!(_i < questObjectiveTypes_1.length)) return [3 /*break*/, 10];
                    questObjectiveType = questObjectiveTypes_1[_i];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    insertQuestObjectiveTypeParams = [
                        questObjectiveType.id,
                        questObjectiveType.name.fr,
                    ];
                    return [4 /*yield*/, pool.execute(insertQuestObjectiveTypeQuery, insertQuestObjectiveTypeParams)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_9 = _a.sent();
                    console.error("Error inserting item:", error_9);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 3];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_10 = _a.sent();
                    console.error(error_10);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function fetchQuestCategoriesAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertQuestCategoryQuery, responseQuestCategories, questCategories, _i, questCategories_1, questCategory, insertQuestCategoryParams, error_11, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = "CREATE TABLE IF NOT EXISTS quest_categories (\n        id INT,\n        name VARCHAR(100),\n        `order` INT,\n        questIds JSON\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertQuestCategoryQuery = "INSERT INTO quest_categories (id, name, `order`, questIds) VALUES (?, ?, ?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(450)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/quest-categories?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseQuestCategories = _a.sent();
                    skip += 50;
                    questCategories = responseQuestCategories.data.data;
                    if (questCategories.length === 0) {
                        console.log("Ended quest categories fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, questCategories_1 = questCategories;
                    _a.label = 6;
                case 6:
                    if (!(_i < questCategories_1.length)) return [3 /*break*/, 11];
                    questCategory = questCategories_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertQuestCategoryParams = [
                        questCategory.id,
                        questCategory.name.fr,
                        questCategory.order,
                        JSON.stringify(questCategory.questIds),
                    ];
                    return [4 /*yield*/, pool.execute(insertQuestCategoryQuery, insertQuestCategoryParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_11 = _a.sent();
                    console.error("Error inserting item:", error_11);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_12 = _a.sent();
                    console.error(error_12);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchAchievementsObjectivesAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertAchievementObjectiveQuery, responseAchievementsObjectives, achievementsObjectives, _i, achievementsObjectives_1, achievementObjective, insertAchievementObjectiveParams, error_13, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = "CREATE TABLE IF NOT EXISTS achievement_objectives (\n        id INT,\n        achievement_id INT,\n        name VARCHAR(100),\n        `order` INT,\n        readableCriterions JSON\n      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    skip += 50;
                    insertAchievementObjectiveQuery = "INSERT INTO achievement_objectives (id, achievement_id, name, `order`, readableCriterions) VALUES (?, ?, ?, ?, ? )";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(200)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/achievement-objectives?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseAchievementsObjectives = _a.sent();
                    skip += 50;
                    achievementsObjectives = responseAchievementsObjectives.data.data;
                    if (achievementsObjectives.length === 0) {
                        console.log("Ended achievements objectives fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, achievementsObjectives_1 = achievementsObjectives;
                    _a.label = 6;
                case 6:
                    if (!(_i < achievementsObjectives_1.length)) return [3 /*break*/, 11];
                    achievementObjective = achievementsObjectives_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertAchievementObjectiveParams = [
                        achievementObjective.id,
                        achievementObjective.achievementId,
                        achievementObjective.name.fr,
                        achievementObjective.order,
                        JSON.stringify(achievementObjective.readableCriterion),
                    ];
                    return [4 /*yield*/, pool.execute(insertAchievementObjectiveQuery, insertAchievementObjectiveParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_13 = _a.sent();
                    console.error("Error inserting item:", error_13);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_14 = _a.sent();
                    console.error(error_14);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchAchievementsCategoriesAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertAchievementCategoryQuery, responseAchievementsCategories, achievementsCategories, _i, achievementsCategories_1, achievementCategory, insertAchievementCategoryParams, error_15, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = "CREATE TABLE IF NOT EXISTS achievements_categories (\n        id INT,\n        name VARCHAR(100),\n        parentId INT,\n        parentName VARCHAR(100),\n        img TEXT,\n        color VARCHAR(12),\n        achievementIds JSON\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertAchievementCategoryQuery = "INSERT INTO achievements_categories (id, name, parentId, parentName, img, color, achievementIds) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 11];
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/achievement-categories?$limit=50&$skip=".concat(skip))];
                case 4:
                    responseAchievementsCategories = _a.sent();
                    skip += 50;
                    achievementsCategories = responseAchievementsCategories.data.data;
                    if (achievementsCategories.length === 0) {
                        console.log("Ended achievements categories fetching.");
                        return [3 /*break*/, 11];
                    }
                    _i = 0, achievementsCategories_1 = achievementsCategories;
                    _a.label = 5;
                case 5:
                    if (!(_i < achievementsCategories_1.length)) return [3 /*break*/, 10];
                    achievementCategory = achievementsCategories_1[_i];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    insertAchievementCategoryParams = [
                        achievementCategory.id,
                        achievementCategory.name.fr,
                        achievementCategory.parentId,
                        achievementCategory.icon,
                        achievementCategory.color,
                        JSON.stringify(achievementCategory.achievementIds),
                    ];
                    return [4 /*yield*/, pool.execute(insertAchievementCategoryQuery, insertAchievementCategoryParams)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_15 = _a.sent();
                    console.error("Error inserting item:", error_15);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 3];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_16 = _a.sent();
                    console.error(error_16);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function fetchAchievementsRewardsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertAchievementRewardQuery, responseAchievementsRewards, achievementsRewards, _i, achievementsRewards_1, achievementReward, insertAchievementRewardParams, error_17, error_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skip = 0;
                    query = "CREATE TABLE IF NOT EXISTS achievements_rewards (\n        id INT,\n        achievement_id INT,\n        kamasRatio INT,\n        experienceRatio INT,\n        itemsReward JSON,\n        emotesReward JSON,\n        spellsReward JSON,\n        titlesReward JSON,\n        ornamentsReward JSON\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _a.sent();
                    insertAchievementRewardQuery = "INSERT INTO achievements_rewards (id, achievement_id, kamasRatio, experienceRatio, itemsReward, emotesReward, spellsReward, titlesReward, ornamentsReward) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 11];
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/achievement-rewards?$limit=50&$skip=".concat(skip))];
                case 4:
                    responseAchievementsRewards = _a.sent();
                    skip += 50;
                    achievementsRewards = responseAchievementsRewards.data.data;
                    if (achievementsRewards.length === 0) {
                        console.log("Ended achievements rewards fetching.");
                        return [3 /*break*/, 11];
                    }
                    _i = 0, achievementsRewards_1 = achievementsRewards;
                    _a.label = 5;
                case 5:
                    if (!(_i < achievementsRewards_1.length)) return [3 /*break*/, 10];
                    achievementReward = achievementsRewards_1[_i];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    insertAchievementRewardParams = [
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
                    return [4 /*yield*/, pool.execute(insertAchievementRewardQuery, insertAchievementRewardParams)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_17 = _a.sent();
                    console.error("Error inserting item:", error_17);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 3];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_18 = _a.sent();
                    console.error(error_18);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function fetchAchievementsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertAchievementQuery, responseAchievements, achievements, _i, achievements_1, achievement, insertAchievementParams, error_19, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    skip = 0;
                    query = "CREATE TABLE IF NOT EXISTS achievements (\n    id INT,\n    name VARCHAR(100),\n    description TEXT,\n    category_id INT,\n    points INT,\n    level INT,\n    img TEXT\n) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    return [4 /*yield*/, pool.execute(query)];
                case 1:
                    _b.sent();
                    insertAchievementQuery = "INSERT INTO achievements (id, name, description, category_id, points, level, img) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 13, , 14]);
                    _b.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(200)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/achievements?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseAchievements = _b.sent();
                    skip += 50;
                    achievements = responseAchievements.data.data;
                    if (achievements.length === 0) {
                        console.log("Ended achievements fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, achievements_1 = achievements;
                    _b.label = 6;
                case 6:
                    if (!(_i < achievements_1.length)) return [3 /*break*/, 11];
                    achievement = achievements_1[_i];
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    insertAchievementParams = [
                        achievement.id,
                        achievement.name.fr,
                        achievement.description.fr,
                        achievement.categoryId,
                        achievement.points,
                        achievement.level,
                        achievement.img,
                    ];
                    return [4 /*yield*/, pool.execute(insertAchievementQuery, insertAchievementParams)];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_19 = _b.sent();
                    console.error("Error inserting item:", error_19);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    _a = _b.sent();
                    console.error("error in achievements");
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchItemsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, insertItemParams, effect, query, insertItemQuery, responseItems, items, _i, items_1, item, i, error_20, error_21, error_22;
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
                    _a.trys.push([2, 20, , 21]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 19];
                    return [4 /*yield*/, delay(350)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/items?$limit=150&$skip=".concat(skip))];
                case 5:
                    responseItems = _a.sent();
                    skip += 50;
                    items = responseItems.data.data;
                    if (items.length === 0) {
                        console.log("Ended items fetching.");
                        return [3 /*break*/, 19];
                    }
                    _i = 0, items_1 = items;
                    _a.label = 6;
                case 6:
                    if (!(_i < items_1.length)) return [3 /*break*/, 18];
                    item = items_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 16, , 17]);
                    if (!(item.effects.length == 0)) return [3 /*break*/, 9];
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
                    return [4 /*yield*/, pool.execute(insertItemQuery, insertItemParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 9:
                    i = 0;
                    _a.label = 10;
                case 10:
                    if (!(i < item.effects.length)) return [3 /*break*/, 15];
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 13, , 14]);
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
                    }
                    else {
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
                    return [4 /*yield*/, pool.execute(insertItemQuery, insertItemParams)];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 13:
                    error_20 = _a.sent();
                    return [3 /*break*/, 14];
                case 14:
                    i++;
                    return [3 /*break*/, 10];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_21 = _a.sent();
                    return [3 /*break*/, 17];
                case 17:
                    _i++;
                    return [3 /*break*/, 6];
                case 18: return [3 /*break*/, 3];
                case 19: return [3 /*break*/, 21];
                case 20:
                    error_22 = _a.sent();
                    console.error("Error fetching items:", error_22);
                    return [3 /*break*/, 21];
                case 21: return [2 /*return*/];
            }
        });
    });
}
function fetchCharacteristicsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertCharacteristicQuery, responseCharacteristics, characteristics, _i, characteristics_1, characteristic, insertCharacteristicParams, error_23, error_24;
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
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(200)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/characteristics?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseCharacteristics = _a.sent();
                    skip += 50;
                    characteristics = responseCharacteristics.data.data;
                    if (characteristics.length === 0) {
                        console.log("Ended characteristics fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, characteristics_1 = characteristics;
                    _a.label = 6;
                case 6:
                    if (!(_i < characteristics_1.length)) return [3 /*break*/, 11];
                    characteristic = characteristics_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertCharacteristicParams = [
                        characteristic.id,
                        characteristic.name.fr,
                        "https://dofusdb.fr/icons/characteristics/".concat(characteristic.asset, ".png"),
                    ];
                    return [4 /*yield*/, pool.execute(insertCharacteristicQuery, insertCharacteristicParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_23 = _a.sent();
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_24 = _a.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchEffectsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertEffectQuery, responseEffects, effects, _i, effects_1, effect, insertEffectParams, error_25, error_26;
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
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(200)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/effects?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseEffects = _a.sent();
                    skip += 50;
                    effects = responseEffects.data.data;
                    if (effects.length === 0) {
                        console.log("Ended effects fetching.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, effects_1 = effects;
                    _a.label = 6;
                case 6:
                    if (!(_i < effects_1.length)) return [3 /*break*/, 11];
                    effect = effects_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertEffectParams = [
                        effect.id,
                        effect.description.fr || undefined,
                        effect.characteristic,
                    ];
                    return [4 /*yield*/, pool.execute(insertEffectQuery, insertEffectParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_25 = _a.sent();
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_26 = _a.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchRecipesAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, ingredients, quantities, query, insertRecipesQuery, responseRecipes, recipes, _i, recipes_1, recipe, i, insertRecipesParams, error_27;
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
                    _a.trys.push([2, 14, , 15]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 13];
                    return [4 /*yield*/, delay(350)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/recipes?$limit=50&$skip=".concat(skip))];
                case 5:
                    responseRecipes = _a.sent();
                    skip += 50;
                    recipes = responseRecipes.data.data;
                    if (recipes.length == 0) {
                        console.log("Ended recipes fetching.");
                        return [3 /*break*/, 13];
                    }
                    _i = 0, recipes_1 = recipes;
                    _a.label = 6;
                case 6:
                    if (!(_i < recipes_1.length)) return [3 /*break*/, 12];
                    recipe = recipes_1[_i];
                    recipe.quantities.forEach(function (quantity) {
                        quantities.push(quantity.toString());
                    });
                    recipe.ingredientIds.forEach(function (ingredient) {
                        ingredients.push(ingredient.toString());
                    });
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < ingredients.length)) return [3 /*break*/, 10];
                    insertRecipesParams = [
                        recipe.resultId,
                        quantities[i],
                        ingredients[i],
                        recipe.jobId,
                    ];
                    return [4 /*yield*/, pool.execute(insertRecipesQuery, insertRecipesParams)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 7];
                case 10:
                    ingredients = [];
                    quantities = [];
                    _a.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 6];
                case 12: return [3 /*break*/, 3];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_27 = _a.sent();
                    console.error(error_27);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function fetchJobsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var query, insertJobsQuery, jobsResponse, jobs, _i, jobs_1, job, insertJobsParams, error_28;
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
                    _a.trys.push([2, 11, , 12]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 10];
                    return [4 /*yield*/, delay(200)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/jobs?$limit=22")];
                case 5:
                    jobsResponse = _a.sent();
                    jobs = jobsResponse.data.data;
                    _i = 0, jobs_1 = jobs;
                    _a.label = 6;
                case 6:
                    if (!(_i < jobs_1.length)) return [3 /*break*/, 9];
                    job = jobs_1[_i];
                    insertJobsParams = [job.id, job.name.fr];
                    return [4 /*yield*/, pool.execute(insertJobsQuery, insertJobsParams)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log("Ended jobs fetching.");
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_28 = _a.sent();
                    console.error(error_28);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function fetchItemSetsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var query, skip, insertJobsQuery, itemSetsResponse, itemSets, _i, itemSets_1, itemSet, i, _a, _b, itemEffect, insertJobsParams, error_29;
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
                    _c.trys.push([2, 15, , 16]);
                    _c.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 14];
                    return [4 /*yield*/, delay(400)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/item-sets?$limit=50&$skip=".concat(skip))];
                case 5:
                    itemSetsResponse = _c.sent();
                    skip += 50;
                    itemSets = itemSetsResponse.data.data;
                    if (itemSets.length == 0) {
                        console.log("Ended itemSets fetching.");
                        return [3 /*break*/, 14];
                    }
                    _i = 0, itemSets_1 = itemSets;
                    _c.label = 6;
                case 6:
                    if (!(_i < itemSets_1.length)) return [3 /*break*/, 13];
                    itemSet = itemSets_1[_i];
                    i = 0;
                    _c.label = 7;
                case 7:
                    if (!(i < itemSet.effects.length)) return [3 /*break*/, 12];
                    _a = 0, _b = itemSet.effects[i];
                    _c.label = 8;
                case 8:
                    if (!(_a < _b.length)) return [3 /*break*/, 11];
                    itemEffect = _b[_a];
                    insertJobsParams = [
                        itemSet.name.fr,
                        itemSet.name.id,
                        i + 1,
                        itemEffect.characteristic || null,
                        itemEffect.from || null,
                        itemSet.items[0].level,
                    ];
                    return [4 /*yield*/, pool.execute(insertJobsQuery, insertJobsParams)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11:
                    i++;
                    return [3 /*break*/, 7];
                case 12:
                    _i++;
                    return [3 /*break*/, 6];
                case 13: return [3 /*break*/, 3];
                case 14: return [3 /*break*/, 16];
                case 15:
                    error_29 = _c.sent();
                    console.error(error_29);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function fetchItemsTypeAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var skip, query, insertIntoItemTypeQuery, response, itemsType, _i, itemsType_1, itemType, insertItemsTypeParams, error_30, error_31;
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
                    _a.trys.push([2, 13, , 14]);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, delay(200)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/item-types?$limit=50&$skip=".concat(skip))];
                case 5:
                    response = _a.sent();
                    skip += 50;
                    itemsType = response.data.data;
                    if (itemsType.length == 0) {
                        console.log("Ended fetching items types.");
                        return [3 /*break*/, 12];
                    }
                    _i = 0, itemsType_1 = itemsType;
                    _a.label = 6;
                case 6:
                    if (!(_i < itemsType_1.length)) return [3 /*break*/, 11];
                    itemType = itemsType_1[_i];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    insertItemsTypeParams = [itemType.name.fr, itemType.id];
                    return [4 /*yield*/, pool.execute(insertIntoItemTypeQuery, insertItemsTypeParams)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_30 = _a.sent();
                    console.error("error inserting itemtype ".concat(error_30));
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 3];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_31 = _a.sent();
                    console.error("error fetching items-type: ".concat(error_31));
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fetchMobsAndInsertIntoDB(pool) {
    return __awaiter(this, void 0, void 0, function () {
        var query, insertMobsQuery, skip, mobsResponse, mobs, _i, mobs_1, mob, _a, _b, grade, insertMobsParams, error_32, error_33;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    query = "CREATE TABLE IF NOT EXISTS mobs (\n        name VARCHAR(100),\n        id INT,\n        level INT,\n        img TEXT,\n        lifePoints INT,\n        actionPoints INT,\n        mouvementPoints INT,\n        vitality INT,\n        paDodge INT,\n        pmDodge INT,\n        wisdom INT,\n        earthResistance INT,\n        airResistance INT,\n        fireResistance INT,\n        waterResistance INT,\n        neutralResistance INT,\n        strength INT,\n        intelligence INT,\n        chance INT,\n        agility INT\n    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                    pool.execute(query);
                    insertMobsQuery = "INSERT INTO mobs (name, id, level, img, lifePoints, actionPoints, mouvementPoints, vitality, paDodge, pmDodge, wisdom, earthResistance, airResistance, fireResistance, waterResistance, neutralResistance, strength, intelligence, chance, agility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 14, , 15]);
                    return [4 /*yield*/, delay(450)];
                case 2:
                    _c.sent();
                    skip = 0;
                    _c.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 13];
                    return [4 /*yield*/, axios_1.default.get("https://api.beta.dofusdb.fr/monsters?$limit=50&$skip=".concat(skip))];
                case 4:
                    mobsResponse = _c.sent();
                    skip += 50;
                    mobs = mobsResponse.data.data;
                    if (mobs.length == 0) {
                        console.log("Ended mobs fetching.");
                        return [2 /*return*/];
                    }
                    _i = 0, mobs_1 = mobs;
                    _c.label = 5;
                case 5:
                    if (!(_i < mobs_1.length)) return [3 /*break*/, 12];
                    mob = mobs_1[_i];
                    _a = 0, _b = mob.grades;
                    _c.label = 6;
                case 6:
                    if (!(_a < _b.length)) return [3 /*break*/, 11];
                    grade = _b[_a];
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 9, , 10]);
                    insertMobsParams = [
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
                    return [4 /*yield*/, pool.execute(insertMobsQuery, insertMobsParams)];
                case 8:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_32 = _c.sent();
                    console.error("error insterting into mobs".concat(error_32));
                    return [3 /*break*/, 10];
                case 10:
                    _a++;
                    return [3 /*break*/, 6];
                case 11:
                    _i++;
                    return [3 /*break*/, 5];
                case 12: return [3 /*break*/, 3];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_33 = _c.sent();
                    console.error("error in while true ".concat(error_33));
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
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
                while (true) { }
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
        var query, skip, insertDropsQuery, dropsReponse, mobs, _i, mobs_2, mob, _a, _b, drop, insertDropsParams, error_34, error_35;
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
                        console.log("Ended drops fetching.");
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
                    insertDropsParams = [
                        drop.monsterId,
                        drop.objectId,
                        drop.percentDropForGrade1,
                        drop.hasCriteria,
                    ];
                    return [4 /*yield*/, pool.execute(insertDropsQuery, insertDropsParams)];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _a++;
                    return [3 /*break*/, 6];
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_34 = _c.sent();
                    return [3 /*break*/, 11];
                case 11:
                    _i++;
                    return [3 /*break*/, 4];
                case 12: return [3 /*break*/, 2];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_35 = _c.sent();
                    console.error(error_35);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var pool, error_36;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, mysql.createPool(dbConfig)];
                case 1:
                    pool = _a.sent();
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
                    return [4 /*yield*/, fetchRecipesAndInsertIntoDB(pool)];
                case 2:
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
                    _a.sent();
                    //DONE await fetchMobsAndInsertIntoDB(pool);
                    //DONE await fetchMobsDropAndInsertIntoDB(pool);
                    return [4 /*yield*/, pool.end()];
                case 3:
                    //DONE await fetchMobsAndInsertIntoDB(pool);
                    //DONE await fetchMobsDropAndInsertIntoDB(pool);
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_36 = _a.sent();
                    console.log(error_36);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
