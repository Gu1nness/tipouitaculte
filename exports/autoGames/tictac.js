const MAX = 30
const MIN = 3

const boomTable = [
  "https://media.tenor.com/images/abd1a7caf83fd0fe0c8136ec25d1bb88/tenor.gif",
  "https://cdn.discordapp.com/attachments/479315447452532746/693234131240222800/image0.jpg",
  "https://cdn.discordapp.com/attachments/479315447452532746/693481167994880020/giphy.gif",
  "https://i.gifer.com/22ks.gif",
  "https://media.giphy.com/media/2sddCIZRYfiPlNeLZn/giphy.gif",
  "https://media.giphy.com/media/z9iE1SPAptyLK/giphy.gif",
  "https://media.giphy.com/media/xTiTnK1UBZjC4sW6mA/giphy.gif",
  "https://media.giphy.com/media/d4aVHC1HKnButuXC/giphy.gif",
  "https://media.giphy.com/media/l4lQW9KfRQscU0ds4/giphy.gif",
  "https://media.giphy.com/media/C9rGEm6SUnOE/giphy-downsized.gif",
  "https://media.giphy.com/media/AAWBs9MMvLfnW/giphy.gif",
  "https://static.vecteezy.com/system/resources/previews/000/416/818/non_2x/boom-flash-on-white-vector.jpg"
]

module.exports = {
  activated: true,
  methodName: "tictac",
  name : "Tic Tac Boom",
  desc : "Fait exploser la bombe de façon aléatoire",
  trigger: /[tT][a-zA-Z]+[cCkK]/,
  server: "tipoui",
  channel: PUB.salons.tictacboom.id,
  init : function() {
    if (games[this.name]) {
      games[this.name].stop()
    }
    maxilog[global[this.server].id].send(`${this.name} commence.`)
    this.nbMsg = 0
    this.limit = Math.ceil(Math.random() * (MAX - MIN)) + MIN
    games[this.name] = global[this.server].channels.get(this.channel).createMessageCollector( m => !!m.content.match(this.trigger))
    games[this.name].on("end", () => maxilog[global[this.server].id].send(`${this.name} a pris fin.`))
    games[this.name].on("collect", m => {
      this.nbMsg++
      if (this.nbMsg >= this.limit) {
        global[this.server].channels.get(this.channel).send("BOOM ! ", {files:[boomTable[Math.floor(Math.random() * boomTable.length)]]})
        this.nbMsg = 0
        this.limit = Math.ceil(Math.random() * (MAX - MIN)) + MIN
      }
    })
  }
}