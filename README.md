# Custom Plant Growing Framework
A mini framework for creating custom-growing plants outside the regular crop system in Bloxd.

## --- Installation ---
Paste the code from src/minified.js or src/unminified.js into *World Code*.

## --- Usage ---
There are multiple variables you can configure, like the valid plants, growth stages and harvest types.

### array `validPlants`
```js
validPlants = []
```
In the array `validPlants`, you can enter a list of Bloxd items/blocks that can grow.
These blocks represent the initial stage of each plant.

For example, your array could be like this:
```js
validPlants = [
  "Red Mushroom",
  "Dangling Vine"
]
```



### object `growthStages`
```js
growthStages = {}
```
This object has keys from the array `validPlants` (as mentioned earlier). This object uses entries from validPlants as keys, containing configurable properties like `ingameName`, `stage_<number>`, and `timeTakenPerStage`.

A block can have any number of stages greater than 1.
Stage 0 (`stage_0`) is the initial block name of the block when it is placed.
Every subsequent stage is numbered in ascending order, in the format `stage_<number>`, where `<number>` is the stage number after 0.

The time taken per stage (`timeTakenPerStage`) is the number of milliseconds before the block changes into its next stage.

Typical format:
```js
growthStages = {
  "<blockName>": {
    ingameName: "<customPlantName>",
    stage_0: "<originalBlockName>",
    stage_1 onwards: "<nextStageBlockName>",
    timeTakenPerStage: <timeTaken>
  }
}
```
where the text in the angle brackets represent the values that need to be inputted.

For example:
```js
growthStages = {
  "Pine Sapling": {
    ingameName: "Pinecone",
    stage_0: "Pine Sapling",
    stage_1: "Pine Leaves",
    stage_2: "Pine Cone Leaves",
    timeTakenPerStage: 2000
  }
}
```
