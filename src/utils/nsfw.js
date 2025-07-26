import * as nsfwjs from 'nsfwjs'

let model = null;
let modelPromise = null;

async function loadModel() {
  if (model) return model;
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    let cacheModel = null;
    try {
      cacheModel = await nsfwjs.load(`indexeddb://nsfw-model`);
    } catch {
      cacheModel = await nsfwjs.load();
      await cacheModel.model.save(`indexeddb://nsfw-model`);
    }

    return cacheModel;
  })();

  return modelPromise;
}

export async function isNSFW(imgElement) {
  try {
    const model = await loadModel();
    const predictions = await model.classify(imgElement);

    const topPrediction = predictions.reduce((max, curr) =>
      curr.probability > max.probability ? curr : max
    );

    const result = ["Porn", "Sexy"].includes(topPrediction.className);
    // console.log({src: imgElement.src, predictions});
    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
}