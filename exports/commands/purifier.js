module.exports = {
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.tipoui.debug, PUB.tipoui.bots]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "whitelist",
      list: [PUB.tipoui.pourfendeureuse]
    },
    name : "Purifier",
    desc : "Accorder l'accès au salon du Bûcher et le rôle de Pourfendeureuse de Cismecs à eun membre.",
    schema : "!purifier <@>",
    channels : "🦄la-maison-de-la-bot",
    authors : "Toustes",
    roleNames : "🔥Pourfendeureuse de cismecs"
  },
  run : function(params, msg) {
    let target
    if(TiCu.Mention(params[0])) {target = TiCu.Mention(params[0])} else return TiCu.Log.Error("purifier", "cible invalide", msg)
    if(!target.roles.find(e => e.id === PUB.tipoui.pourfendeureuse)) {
      target.addRole(PUB.tipoui.pourfendeureuse)
      TiCu.Log.Commands.Purifier(target, msg)
    } else return TiCu.Log.Error("purifier", "cible déjà Pourfendeureuse de Cismecs", msg)
  }
}
