let dateFormat = require("dateformat")
dateFormat.i18n = {
    dayNames: [
        "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
    ],
    monthNames: [
        "Jan", "F�v", "Mars", "Avr", "Mai", "Juin", "Juil", "Ao�t", "Sept", "Oct", "Nov", "D�c", "Janvier", "F�vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao�t", "Septembre", "Octobre", "Novembre", "D�cembre"
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
}

module.exports = {
  alias: [
    "time",
    "date",
    "arriv�",
    "arriv�e",
    "arriver"
  ],
  activated: true,
  name : "Time",
  desc : "Donne la date et l'heure de votre derni�re arriv�e sur le serveur.",
  schema : "!time",
  authorizations : TiCu.Authorizations.getAuth("command", "time"),
  run : function(params, msg) {
      if (msg.member === PUB.user.yuffy.id) {
          d = new Date()
          msg.reply("tu es arriv�e sur le serveur " + dateFormat(d, "dddd d mmmm yyyy") + "� 13:12.")
      } else {
          d = msg.member.joinedAt
          msg.reply("tu es arriv� sur le serveur " + dateFormat(d, "dddd d mmmm yyyy � HH:MM:ss") + ".")
      }
  }
}
