module.exports = {
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.tipoui.debug, PUB.tipoui.invite]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "whitelist",
      list: [PUB.tipoui.turquoise]
    },
    name : "Bienvenue",
    desc : "Accorder le rôle Phosphate à eun membre.",
    schema : "!bienvenue <@>",
    channels : "🌍présentations📜",
    authors : "Toustes",
    roleNames : "💠Turquoise"
  },
  run : function(params, msg) {
    let target
    if(TiCu.Mention(params[0])) {target = TiCu.Mention(params[0])} else return TiCu.Log.Error("bienvenue", "cible invalide", msg)
    if(!target.roles.find(e => e.id === PUB.tipoui.phosphate)) {
      target.addRole(PUB.tipoui.phosphate)
      TiCu.Log.Commands.Bienvenue(target, msg)
    } else return TiCu.Log.Error("bienvenue", "cible déjà phosphate", msg)
  }
}