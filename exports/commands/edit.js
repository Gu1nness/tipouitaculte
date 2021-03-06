module.exports = {
  alias: [
    "edit"
  ],
  activated: true,
  name : "Edit",
  desc : "Édite un message envoyé par l'intermédiaire de ce bot.",
  schema : "!edit <#channel> <idMessage> <texte>\nou\n!edit <urlMessage> <texte>",
  authorizations : TiCu.Authorizations.getAuth("command", "edit"),
  run : function(params, msg) {
    if (params.length < 2) {
      return TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    }
    let promiseToMessage
    const isById = TiCu.Channels.isValidChannelId(params[0])
    if (isById) {
      promiseToMessage = TiCu.Messages.fetchMessageFromId(params[0], params[1], msg, "edit")
    } else {
      promiseToMessage = TiCu.Messages.fetchMessageFromUrl(params[0], msg, "edit")
    }
    if (promiseToMessage) {
      promiseToMessage.then(
        messageToEdit => {
          if (messageToEdit.author.id === PUB.users.tipouitaculte.id) {
            let crop = dev ?
              isById ?
                new RegExp(/^(%[e|E]dit\s+[^\s]+\s+[^\s]+\s+)/) :
                new RegExp(/^(%[e|E]dit\s+[^\s]+\s+)/)
              : isById ?
                new RegExp(/^(![e|E]dit\s+[^\s]+\s+[^\s]+\s+)/) :
                new RegExp(/^(![e|E]dit\s+[^\s]+\s+)/)
            let content = msg.content.match(crop) ? msg.content.substring(msg.content.match(crop)[0].length) : false
            if (content !== "") {
              messageToEdit.edit(content).then(newMsg => TiCu.Log.Commands.Edit(newMsg, msg))
            } else TiCu.Log.Error("edit", "il manque le nouveau contenu du message", msg)
          } else TiCu.Log.Error("edit", "je ne peux pas éditer un message que je n'ai pas envoyé", msg)
        }
      ).catch(() => TiCu.Log.Error("edit", "impossible de trouver le message à éditer", msg))
    } else TiCu.Log.Error("edit", "impossible de trouver le message à éditer", msg)
  }
}
