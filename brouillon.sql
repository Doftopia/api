SELECT items.name AS itemName,
  characteristics.name AS characName, 
  items.id as itemId, 
  characteristics.img_url as characImg, 
  items.description as itemDescription, 
  items.level, items.type, items.img, items.imgHighRes, items.apCost, items.maxRange, items.minRange, effects.description as effectDescription, 
  items.nmbCast, items.criticalHitProbability, items.weaponDmgFrom as characFrom, 
  items.weaponDmgTo as characTo, items.itemCharacteristics as characId, setName, setId, effectId 
  FROM items 
    LEFT JOIN characteristics ON items.itemCharacteristics = characteristics.characteristic_id 
      LEFT JOIN effects on items.effectId = effects.id


SELECT achievements_categories.name AS AchievementCategory, 
  achievements.name AS AchievementName,
  achievements.description AS AchievementDesc,
  achievements.points AS AchievementPoints,
  achievements.img AS AchievementImg,
  achievements.id AS AchievementId,
  achievements.level AS AchievementLevel
FROM achievements
LEFT JOIN achievements_categories ON achievements.category_id = achievements_categories.id;


SELECT quest_categories.id AS questId,
  quest_categories.name AS questName,
  quest_categories.order AS 'order'
  FROM quest_categories;


SELECT quests.id as questId,
  quests.name as questName,
  quests.levelMin as minLvl,
  quests.categoryId as categoryId,
  quest_categories.name as categoryName,
  quests.stepIds as steps
FROM quests
LEFT JOIN quest_categories ON quest_categories.id  = quests.categoryId

