module.exports = {
  Error : function(cmd, err, msg) {
    if(cmd === "vote") {
      msg.channel.send("Erreur avec la commande `" + cmd + "` : " + err +".")
        .then(newMsg => {
          msg.delete()
          newMsg.delete(10000)
        })
      maxilog.send(TiCu.Date("log") + " : Erreur : (`" + cmd + "`, " + err +")")
    } else {
      msg.reply("erreur avec la commande `" + cmd + "` : " + err +".")
      maxilog.send(TiCu.Date("log") + " : Erreur : (`" + cmd + "`, " + err +")")
    }
  },
  Json : function(type, target) {
    if(type === "err") maxilog.send(TiCu.Date("log") + " : JSON\nErreur JSON (" + target + ")")
    else maxilog.send(TiCu.Date("log") + " : JSON\n" + type + " - " + target)
  },
  Quarantaine : function(type, newMsg, msg) {
    maxilog.send(TiCu.Date("log") + " : Quarantaine - " + type + "\n" + newMsg.url)
    msg.react("💬")
  },
  DM : function(embed, msg) {
    maxilog.send(TiCu.Date("log") + " : DM")
    maxilog.send(embed)
    msg.react("💬")
  },
  VoteUpdate : function(usr, emoji, msg) {
    const user = tipoui.members.get(usr)
    maxilog.send(TiCu.Date("log") + " : VoteCollections\n" + user.displayName + " a voté " + emoji + " sur le vote :\n" + msg.url)
    user.send("Votre vote `" + emoji + "` a bien été pris en compte.\n" + msg.url)
  },
  VoteCollector : function(msg) {
    maxilog.send(TiCu.Date("log") + " : VoteCollections\nInitialisation du vote pour le message\n" + msg.url)
  },
  VoteDone : function (reason, type, msg, target) {
    if (type === "text") {
      maxilog.send(TiCu.Date("log") + " : VoteDone\nFin du vote pour le message\n" + msg.url)
    } else {
      maxilog.send(
        TiCu.Date("log") + " : VoteDone\nFin du vote (avec le resultat \"" + reason + "\") pour le message\n" + msg.url +
        "\nVote de " + type + " pour " + tipoui.members.get(target).displayName
      )
    }
  },
  ServerPage : function(req) {
    maxilog.send(TiCu.Date("log") + " : Server\nServed Page : " + req.path)
  },
  Commands : {
    Ban : function(target, reason, msg) {
      maxilog.send(TiCu.Date("log") + " : Ban \n" + msg.member.displayName + " a banni " + target.username + " / " + target.id + ".")
      minilog.send(msg.member.displayName + " a banni " + target.username + ".")
      if(reason) {
        maxilog.send("Raison : " + reason)
        minilog.send("Raison : " + reason)
      }
      msg.react("✅")
    },
    Bienvenue : function(target, msg) {
      maxilog.send(TiCu.Date("log") + " : Bienvenue \n" + msg.member.displayName + " a souhaité la bienvenue à " + target.displayName + " / " + target.id + ".")
      minilog.send(msg.member.displayName + " a souhaité la bienvenue à " + target.displayName + ".")
      tipoui.channels.get(PUB.tipoui.invite).send("Bienvenue " + target.displayName + " ! <:patatecoeur:585795622846857256>\nTe voici désormais Phosphate d'Alumine. N'hésite pas à m'envoyer un message privé si tu as des questions sur le serveur ou un message à transmettre aux Vigiliant·es.\nNous espérons que tu seras à ton aise et que tout se passera bien.")
    },
    Color : function(action, color, msg) {
      if(action === "switched") {
        if(color === "turquoise") {
          maxilog.send(TiCu.Date("log") + " : Color\n" + msg.member.displayName + " a réinitialisé sa couleur.")
          msg.react("✅")
        } else {
          maxilog.send(TiCu.Date("log") + " : Color\n" + msg.member.displayName + " a adopté la couleur " + color + ".")
          msg.react("✅")
        }
      }
      if(action === "deleted") {
        maxilog.send(TiCu.Date("log") + " : Color\n" + "La couleur " + color + " a été supprimée.")
        msg.react("✔")
      }
    },
    Kick : function(target, reason, msg) {
      maxilog.send(TiCu.Date("log") + " : Kick \n" + msg.member.displayName + " a kické " + target.username + " / " + target.id + ".")
      minilog.send(msg.member.displayName + " a kické " + target.username + ".")
      if(reason) {
        maxilog.send("Raison : " + reason)
        minilog.send("Raison : " + reason)
      }
      msg.react("✅")
    },
    Purifier : function(target, msg) {
      maxilog.send(TiCu.Date("log") + " : Purifier \n" + msg.member.displayName + " a ajouté " + target.displayName + " parmi les Pourfendeureuses de Cismecs.")
      minilog.send(msg.member.displayName + " a ajouté " + target.displayName + " parmi les Pourfendeureuses de Cismecs.")
      msg.react("✅")
    },
    Quarantaine : function(action, target, reason, msg) {
      if(action) {
        minilog.send(msg.member.displayName + "a mis " + target.displayName + " en quarantaine.")
        maxilog.send(TiCu.Date("log") + " : Quarantaine\n" + msg.member.displayName + " a mis " + target.displayName + " / " + target.id + " en quarantaine.")
        tipoui.channels.get(PUB.tipoui.quarantaineUser).send("<@" + target.id + ">, tu as été placé·e en quarantaine. Tous les messages que tu transmetras dans ce salon seront transmis aux Vigilant·es, comme lorsque tu m'envoie un message privé, et je m'occuperais de transmettre leurs réponses.\n⚠Quitter le serveur alors que tu es ici te vaudra un ban immédiat.⚠")
        msg.react("✅")
      } else {
        minilog.send(msg.member.displayName + "a enlevé " + target.displayName + " de quarantaine.")
        maxilog.send(TiCu.Date("log") + " : Quarantaine\n" + msg.member.displayName + " a enlevé " + target.displayName + " / " + target.id + " de quarantaine.")
        msg.react("✅")
      }
      if(reason) {
        minilog.send("Raison : " + reason)
        maxilog.send("Raison : " + reason)
      }
    },
    Roles : function(target, action, roles, msg) {
      let author = msg.member ? msg.member.displayName : msg.author.username
      let roleNames = ""
      for(i=0;i<roles.length;i++) {
        roleNames += "`" + tipoui.roles.get(roles[i]).name + "` "
      }
      action = (action === "addRoles") ? "ajoué" : "enlevé"
      minilog.send(author + " a " + action + " des rôles à " + target.displayName)
      maxilog.send(TiCu.Date("log") + " : Roles\n" + author + " a " + action + " des rôles à " + target.displayName + "\n" + roleNames)
      msg.react("✅")
    },
    Send : function(cmdMsg, newMsg) {
      let author = cmdMsg.member ? cmdMsg.member.displayName : cmdMsg.author.username
      maxilog.send(TiCu.Date("log") + " : Send \n" + author + " a envoyé un message vers `" + newMsg.channel.toString() + "`\n" + newMsg.url)
      maxilog.send(newMsg.toString())
      minilog.send(author + " a envoyé un message vers " + newMsg.channel.toString())
      cmdMsg.react("✅")
    },
    Vote : {
      Public : function(msg) {
        minilog.send(msg.member.displayName + " a lancé un vote public")
        maxilog.send(TiCu.Date("log") + " : Vote\n" + msg.member.displayName + " a lancé un vote public :\n" + msg.url)
        maxilog.send(msg.content)
      },
      Anon : function(type, params, newMsg, msg) {
        /* Might receive empty params[2] */
        if(type === "text") {
          minilog.send(msg.member.displayName + " a lancé un vote anonyme")
        } else {
          minilog.send(msg.member.displayName + " a lancé un vote anonyme pour " + type + " " + TiCu.Mention(params[2]) )
          maxilog.send(TiCu.Date("log") + " : Vote\n" + msg.member.displayName + " a lancé un vote anonyme : " + type + TiCu.Mention(params[2]) + "\n" + msg.url)
        }
        maxilog.send(newMsg.content)
        msg.delete()
      }
    }
  },
  ReactionError: function(reaction, usr, type) {
    let errorText;
    if (type === "add") {
      errorText = tipoui.members.get(usr.id).displayName + " tried to trigger a bot reaction by reacting to " + reaction.message.url + " with " + reaction.emoji.name
    } else {
      errorText = tipoui.members.get(usr.id).displayName + " tried to trigger a bot reaction by deleting their reaction " + reaction.emoji.name + " to " + reaction.message.url
    }
    maxilog.send(TiCu.Date("log") + " : ReactionError\nSomething went wrong with authorizations\n" + errorText)
  },
  Reactions: {
    genericReaction: function(reaction, usr, type) {
      if (type === "add") {
        maxilog.send(TiCu.Date("log") + " : ReactionAdd\n" + tipoui.members.get(usr.id).displayName + " a réagit à " + reaction.message.url + " avec " + reaction.emoji.name)
      } else {
        maxilog.send(TiCu.Date("log") + " : ReactionRemove\n" +tipoui.members.get(usr.id).displayName + " a supprimé sa réaction " + reaction.emoji.name + " à " + reaction.message.url)
      }
    },
    Heart: function(reaction, usr, type) {
      if (type === "add") {
        maxilog.send(TiCu.Date("log") + " : ReactionHeartAdd\n" + tipoui.members.get(usr.id).displayName + " a ajouté un coeur à " + reaction.message.url)
      } else {
        maxilog.send(TiCu.Date("log") + " : ReactionHeartRemove\n" +tipoui.members.get(usr.id).displayName + " a retiré un coeur à " + reaction.message.url)
      }
    }
  },
  Auto: {
    SuchTruc: function(msg) {
      maxilog.send(TiCu.Date("log") + " : SuchTruc\nSuch Log, much info !" + msg.url)
    }
  },
  XP: {
    newEntry: function(entry) {
      maxilog.send(`${TiCu.Date("log")} : newXPMember\n${tipoui.members.get(entry.id).displayName} was added to the XP system`)
    },
    levelChange: function(entry, previousLevel) {
      maxilog.send(`${TiCu.Date("log")} : levelChange\n${tipoui.members.get(entry.id).displayName} changed level from ${previousLevel} to ${entry.level}`)
    },
    error: function(type, target) {
      switch(type) {
        case TiCu.Xp.errorTypes.MULTIPLEUPDATE:
          maxilog.send(`${TiCu.Date("log")} : XP ERROR\nThere was a problem updating the XP for ${tipoui.members.get(target).displayName} : updated multiple entries`)
          break;
        default:
          maxilog.send(`${TiCu.Date("log")} : XP ERROR\nGeneric error, sorry for the lack of information`)
      }
    }
  }
}
