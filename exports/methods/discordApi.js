const API_HOST = 'discordapp.com'
const API_BASE_PATH = '/api'

function createBaseRequest(options, callbackSuccess, postData = null) {
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 204) {
        callbackSuccess(data)
      } else if (res.statusCode === 429) {
        /* How to retry an HTTP call ? Seems to work buuuuuuuuuuuuut... */
        const retryTime = JSON.parse(data).retry_after
        setTimeout(function() {
          const retryReq = createBaseRequest(options, callbackSuccess)
          if (postData !== null) {
            retryReq.write(postData)
          }
          retryReq.end()
        }, retryTime + 1000);
      }
    })
  })
  req.on('error', error => {
    console.log(error)
  })
  if (postData !== null) {
    req.write(postData)
  }
  return req
}

function defineOptions(path, method) {
  return {
    hostname: API_HOST,
    path: `${API_BASE_PATH}${path}`,
    method: method,
    headers: {
      'Authorization': `Bot ${CFG.discordToken}`
    }
  }
}

module.exports = {
  getMessagesBefore: function(salonId, snowflakeBefore, callbackSuccess) {
    setTimeout(function() {
      createBaseRequest(
        defineOptions(`/channels/${salonId}/messages?limit=100&before=${snowflakeBefore}`, 'GET'),
        callbackSuccess
      ).end()
    }, 500)
  },
  deleteMessage: function(salonId, messageId, callbackSuccess) {
    setTimeout(function() {
      createBaseRequest(
        defineOptions(`/channels/${salonId}/messages/${messageId}`, 'DELETE'),
        callbackSuccess
      ).end()
    }, 500)
  },
  getGuildChannels: function(guildId, callbackSuccess) {
    createBaseRequest(
      defineOptions(`/guilds/${guildId}/channels`, 'GET'),
      callbackSuccess
    ).end()
  }
}