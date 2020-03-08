function getNameList(idList, type) {
  let nameList = ""
  for (const id of idList) {
    const tipouiMember = tipoui.members.get(id)
    const tipouiRole = tipoui.roles.get(id)
    if (id !== PUB.salons.debug.id) {
      nameList += (
        type === "chans" ?
          salonsById[id] + ", " :
          type === "users" ?
            (tipouiMember ? tipouiMember.displayName + ", " : "") :
            (tipouiRole ? tipouiRole.name + ", " : "")
      )
    }
  }
  return nameList
}

function getDesc(auth, type) {
  let desc = ""
  switch(auth.type) {
    case "any":
      desc = type === "users" ? "Toustes" : "Tous"
      break
    case "whitelist":
      desc = getNameList(auth.list, type)
      desc = desc ? desc.substr(0, desc.length-2) : ""
      break
    case "blacklist":
      desc = (type === "users" ? "Toustes" : "Tous") + " sauf "
      desc += getNameList(auth.list, type)
      desc = desc.substr(0, desc.length-2)
      break
  }
  return desc
}


module.exports = {
  alias: [
    "help"
  ],
  activated: true,
  name : "Help",
  desc : "Liste toutes les commandes, ou seulement celles que vous pouvez utiliser dans ce salon (par défaut), détaille l'usage d'une commande, ou explique le format des \"schémas\" de commandes.",
  schema : "!help (full|commande|schema|rolesList|nmList)",
  authorizations : TiCu.Authorizations.getAuth("command", "help"),
  run : function(params, msg) {
    const target = params[0]
    const embed = new DiscordNPM.RichEmbed()
    embed.setColor(38600)
    const aliasList = []
    if(TiCu.Commands[target]) {
      const cmd = TiCu.Commands[target]
      const chansDesc = getDesc(cmd.authorizations[msg.guild.id].chans, "chans")
      const usersDesc = getDesc(cmd.authorizations[msg.guild.id].auths, "users")
      const rolesDesc = getDesc(cmd.authorizations[msg.guild.id].roles, "roles")
      embed
        .setTitle(cmd.name)
        .addField("Description", cmd.desc)
        .addField("Schéma", cmd.schema)
        .addField("Salons :", chansDesc ? chansDesc : "Fonction réservée au développement", true)
        .addField("Utilisateurices :", usersDesc, true)
        .addField("Rôles :", rolesDesc, true)
      msg.channel.send(embed)
    } else if(TiCu.Auto[target]) {
      const autoCmd = TiCu.Auto[target]
      const chansDesc = getDesc(autoCmd.authorizations.salons, "chans")
      const usersDesc = getDesc(autoCmd.authorizations.users, "users")
      embed
        .setTitle(autoCmd.name)
        .addField("Description", autoCmd.desc)
        .addField("Schéma", autoCmd.schema)
        .addField("Expression régulière", autoCmd.trigger)
        .addField("Salons :", chansDesc ? chansDesc : "Fonction réservée au développement", true)
        .addField("Utilisateurices :", usersDesc, true)
      msg.channel.send(embed)
    } else if(target === "auto") {
      Object.keys(TiCu.Auto).forEach((key, i, array) => {
        if(TiCu.Authorizations.Auto(TiCu.Auto[key], msg)) {
          let cmd = TiCu.Auto[key]
          embed.addField(cmd.name, `${cmd.desc}\nhelp command : \`!help ${cmd.methodName}\``)
        }
      })
      msg.channel.send("Voici la liste de mes réactions automatiques :")
      msg.channel.send(embed)
    } else if(target === "full") {
      Object.keys(TiCu.Commands).forEach((key, i, array) => {
        if (!aliasList.find(v => v === key)) {
          const cmd = TiCu.Commands[key]
          embed.addField(cmd.name, cmd.desc)
          cmd.alias.forEach(aliasName => {
            aliasList.push(aliasName)
          })
        }
      })
      msg.channel.send("Voici la liste exhaustive de mes fonctions :")
      msg.channel.send(embed)
    } else if(target === "schema") {
      embed
        .setTitle("La description individuelle des commandes propose un champ \"Schéma\" pour expliciter son fonctionnement.")
        .addField("`!commande`", "appel de la commande, le message commence par un `!` et le nom de la commande.")
        .addField("`<obligatoire>`", "entre chevrons, ce paramètre doit impérativement être renseigné lors de l'appel de la commande.")
        .addField("`[liste]`", "entre crochets, ce paramètre est une liste de 1 ou plusieurs éléments, séparés par des caractères d'espacement (tout espace unicode, y compris retour à la ligne), obligatoires pour l'appel de la commande.")
        .addField("`(optionnel)`", "entre parenthèses, ce paramètre est facultatif et ne doit pas obligatoirement être présent pour faire fonctionner cette commande.")
        .addField(`|`, "la barre verticale permet de délimiter les variantes d'un paramètre. Par exemple, !piece (pile|face) signifie que l'on peut choisir si l'on gagne avec pile ou avec face.")
        .addField(`@`, "l'arobase signifie que le paramètre attendu permet de trouver eun membre de Tipoui - par mention (<@638410922527817748>), ID (638410922527817748), tag (TipouiTaCulte#4219), nom d'utilisateurice (TipouiTaCulte) ou encore pseudo sur le serveur (💠TipouiTaCulte (x)).")
        .addField("`role`", "le mot-clef \"role\" signifie que le paramètre attendu permet de trouver un rôle sur Tipoui, d'après la liste donnée par la commande `!help rolesList`")
        .addField("`target`", "le mot-clef \"target\" signifie que le paramètre attendu permet de trouver une cible, qui peut être, selon le contexte, eun membre, un salon et/ou un rôle - par mention, ID ou nom en texte brut")
        .addField("`text`", "le mot-clef \"text\" signifie que tout le reste du texte du message sera transmis suite à cette commande.")
        .addField("+", "Pour les commandes ne comportant pas de paramètre `texte`, tout contenu faisant suite aux paramètres nécessaires ne sera pas traîté.")
        .addField("+", "Les mots-clefs qui ne font pas partie de cette liste doivent être renseignés tels quels dans la commande (ils font généralement partie d'un groupe de paramètres variables, comme `(pile|face)` ou `<add|addRole|ajouter>` ...).")
        .addField("+", "Par ailleurs, les paramètres de commande ne sont pas sensibles à la casse, de telle sorte que `addRole`, `ADDROLE` ou `addrole` seront tous traités de la même façon.")
      msg.channel.send(embed)
    } else if(target === "roleslist") {
      embed
        .setColor(38600)
        .setTitle("Liste des rôles et alias pour la commande !roles")
      for (const role of Object.values(PUB.roles)) {
        if (role.givable) {
          let values = ""
          for (let j = 1; j < role.alias.length; j++) {
            values += role.alias[j] + "\n"
          }
          embed.addField(role.id, values, true)
        }
      }
      msg.channel.send(embed)
    } else if(target === "nmlist") {
      embed
        .setColor(38600)
        .setTitle("Liste des accès et alias pour la commande !NonMixtes")
      for (const access of Object.values(PUB.nonmixtes)) {
        let values = ""
        for (let i = 1; i < access.alias.length - 1; i++) {
          values += access.alias[i] + "\n"
        }
        embed.addField(access.alias[0], values, true)
      }
      msg.channel.send(embed)
    } else if(!target) {
      aliasList.push("help")
      Object.keys(TiCu.Commands).forEach((key, i, array) => {
        if (!aliasList.find(v => v === key)) {
          const cmd = TiCu.Commands[key]
          if(TiCu.Authorizations.Command(key, msg)) {
            embed.addField(cmd.name, cmd.desc)
          }
          cmd.alias.forEach(aliasName => {
            aliasList.push(aliasName)
          })
        }
      })
      msg.channel.send("Voici la liste de mes fonctions que vous pouvez utiliser :")
      msg.channel.send(embed)
    } else {
      TiCu.Log.Error("help", "commande inconnue", msg)
    }
  }
}
