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

    const scores = Object.fromEntries(
      predictions.map(p => [p.className, p.probability])
    );

    const NSFW_THRESHOLD = 0.7;
    const NEUTRAL_MAX = 0.3;

    const nsfwScore =
      (scores["Porn"] || 0) +
      (scores["Hentai"] || 0) +
      (scores["Sexy"] || 0) * 0.5;

    const neutralScore = scores["Neutral"] || 0;

    return nsfwScore >= NSFW_THRESHOLD && neutralScore <= NEUTRAL_MAX;
  } catch (err) {
    console.error("NSFW 检测失败:", err);
    return false;
  }
}