// licensed under GPL 3.0 (2025, 2026) Tridentify
// you may redistribute this under the SAME license

// LAST UPDATED: 17-5-2026

validPlants = [
    "Pine Sapling",
    "Maple Sapling",
    "Dangling Vine"
];

ofPlants = {};

growthStages = {
    "Pine Sapling": {
        ingameName: "Pinecone",
        stage_0: "Pine Sapling",
        stage_1: "Pine Leaves",
        stage_2: "Pine Cone Leaves",
        timeTakenPerStage: 2000
    },
    "Maple Sapling": {
        ingameName: "Applebush",
        stage_0: "Maple Sapling",
        stage_1: "Maple Leaves",
        stage_2: "Fruity Maple Leaves",
        timeTakenPerStage: 2000
    },
    "Dangling Vine": {
        ingameName: "Watermelon Plant",
        stage_0: "Dangling Vine",
        stage_1: "Dangling Vine",
        stage_2: "Green Glass",
        stage_3: "Watermelon",
        timeTakenPerStage: 15000
    }
};

harvestTypes = {
    "Fruity Maple Leaves": {
        ingameName: "Applebush",
        droppedItem: "Apple",
        isSingleUse: false,
        trueBlock: "Maple Sapling",
        resetStage: 1,
        harvestCooldown: 1000
    },
    "Pine Cone Leaves": {
        ingameName: "Pinecone",
        droppedItem: "Fallen Pine Cone",
        isSingleUse: false,
        trueBlock: "Pine Sapling",
        resetStage: 1,
        harvestCooldown: 1000
    },
    "Watermelon": {
        ingameName: "Watermelon Plant",
        droppedItem: "Watermelon",
        isSingleUse: false,
        trueBlock: "Dangling Vine",
        resetStage: 2,
        harvestCooldown: 4000
    }
};

onPlayerChangeBlock = (pId, x, y, z, fromBlock, toBlock, item) => {
    api.setBlock(x, y, z, toBlock);
    if (validPlants.includes(toBlock)) {
        ofPlants[pId].push({ name: toBlock, pos: [x, y, z] });
        api.setBlockData(x, y, z, {
            cropData: {
                growthStage: 0,
                nextStageGrowthTime: api.now() + growthStages[toBlock].timeTakenPerStage,
                nextStage: growthStages[toBlock]["stage_1"],
                plantType: toBlock
            }
        });
        let plantName = growthStages?.[toBlock].ingameName;
    }
};

onPlayerJoin = (pId) => {
    ofPlants[pId] = [];
    api.clearInventory(pId);
    api.setClientOption(pId, "droppedItemScale", 1.5);
};

onPlayerLeave = (pId) => {
    delete ofPlants[pId];
};

tick = () => {
    for (let pId in ofPlants) {
        for (let i = ofPlants[pId].length - 1; i >= 0; i--) {
            let blockPos = ofPlants[pId][i].pos;
            let blockData = api.getBlockData(...blockPos)?.cropData;
            if (!blockData) {
                ofPlants[pId].splice(i, 1);
                continue;
            }

            let nextGrowthTime = blockData.nextStageGrowthTime;
            let noStages = Object.keys(growthStages[blockData.plantType])
                .filter(k => k.startsWith("stage_")).length;

            if (blockData.growthStage < noStages) {
                if (api.now() >= nextGrowthTime) {
                    api.setBlock(blockPos, blockData.nextStage);
                    api.setBlockData(...blockPos, {
                        cropData: {
                            growthStage: blockData.growthStage + 1,
                            nextStageGrowthTime: api.now() + growthStages[blockData.plantType].timeTakenPerStage,
                            nextStage: growthStages[blockData.plantType]["stage_" + (blockData.growthStage + 1)],
                            plantType: blockData.plantType
                        }
                    });
                }
            } else {
                api.setBlockData(...blockPos, {});
                ofPlants[pId].splice(i, 1);
            }
        }
    }
};

onPlayerAttemptAltAction = (pId, x, y, z, block) => {
    if (Object.keys(harvestTypes).includes(block) && api.getBlockData(x, y, z) != undefined) {
        if (harvestTypes[block].isSingleUse === true) {
            api.setBlock(x, y, z, "Air");
            api.createItemDrop(x + 0.5, y + 0.5, z + 0.5, harvestTypes[block].droppedItem, 1, false);
        } else {
            let truePlant = harvestTypes[block].trueBlock;
            let resetStage = harvestTypes[block].resetStage;
            let resetBlock = growthStages[truePlant]["stage_" + resetStage];
            api.setBlock(x, y, z, resetBlock);
            api.setBlockData(x, y, z, {
                cropData: {
                    growthStage: resetStage,
                    nextStageGrowthTime: api.now() + growthStages[truePlant].timeTakenPerStage + harvestTypes[block]?.harvestCooldown,
                    nextStage: growthStages[truePlant]["stage_" + (resetStage + 1)],
                    plantType: truePlant
                }
            });
            ofPlants[pId].push({ name: truePlant, pos: [x, y, z] });
            api.createItemDrop(x + 0.5, y + 1.5, z + 0.5, harvestTypes[block].droppedItem, 1, false);
        }
    }
};
