//const GITHUB = "https://antropoloops.github.io/audiosets/";
const STORAGE = "https://storage.googleapis.com/atpls-sets";

function Loader(ctx, events) {
  const buffers = {};

  return {
    get: function(name) {
      return buffers[name];
    },

    load: function(baseUrl, samples, config) {
      const names = Object.keys(samples);
      events.emit("audio.load-all", names);

      const promises = names.map(function(name) {
        const sample = samples[name];
        const url = baseUrl + sample.filename + config.audioFileExt;
        return fetchLocalOrRemote(url)
          .then(function(response) {
            return response.arrayBuffer();
          })
          .then(function(audioData) {
            return ctx.decodeAudioData(audioData);
          })
          .then(function(buffer) {
            events.emit("audio.loaded-file", name);
            buffers[name] = buffer;
          });
      });
      return Promise.all(promises).then(function(buffers) {
        events.emit("audio.loaded-all");
        return buffers;
      });
    }
  };
}

module.exports = Loader;

function fetchLocalOrRemote(url) {
  if (process.env.NODE_ENV !== "production") {
    const local = url.replace(STORAGE, "http://localhost:3333/data/audiosets/");
    return fetch(local).catch(function() {
      return fetch(url);
    });
  } else {
    return fetch(url);
  }
}