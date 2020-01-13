function clearRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });
}

module.exports = {
  alias: [
    "hotreload",
    "hr"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id]
    },
    auths : {
      type: "whitelist",
      list: [PUB.users.xenolune, PUB.users.syrinx]
    },
    roles : {
      type: "any"
    },
    name : "HotReload",
    desc : "Recharge la configuration de TipouiTaCulte",
    schema : "!<hotReload|hr> <parsing|ticu|salons>"
  },
  run : function(params, msg) {
    clearRequireCache()
    const loader = require("../loader")
    switch(params[0]) {
      case "parsing":
        loader.loadParsing()
        TiCu.Log.Commands.HotReload(params[0], msg)
        break
      case "ticu":
        loader.loadTicu("./")
        TiCu.Log.Commands.HotReload(params[0], msg)
        break
      case "salons":
        loader.updateSalonsName()
        TiCu.Log.Commands.HotReload(params[0], msg)
        break
      default:
        TiCu.Log.Error("hotreload", "Vous devez préciser quel type de reload vous souhaitez réaliser (parsing, ticu ou pub)", msg)
    }
  }
}
