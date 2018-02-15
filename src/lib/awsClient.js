import { exec } from 'child_process'

const beginToken = '# mfa-begin'
const endToken = '# mfa-end'

const execPromise = command => new Promise((resolve, reject) => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      return reject(err)
    } else if (stderr) {
      return reject(stderr)
    }
    return resolve(stdout)
  })
})

const awsCommandExec = (token, profile, serialNumber) =>
  execPromise(`aws sts get-session-token \
      --duration-seconds 129600 \
      --serial-number ${serialNumber} \
      --profile ${profile} \
      --token ${token}`)

const updateToken = (token, profile, serialNumber, region, mfaProfile) =>
  awsCommandExec(token, profile, serialNumber)
    .then(response => JSON.parse(response))
    .then((json) => {
      const secretAccessKey = json.Credentials.SecretAccessKey
      const sessionToken = json.Credentials.SessionToken
      const accessKeyId = json.Credentials.AccessKeyId

      const newProfile = `${beginToken}\n[profile ${mfaProfile}]\noutput = json\naws_access_key_id = ${accessKeyId}\naws_secret_access_key = ${secretAccessKey}\naws_session_token = ${sessionToken}\n${endToken}`
      return execPromise(`sed -i '' '/${beginToken}/,/${endToken}/d' ~/.aws/config`)
        .then(() => execPromise(`echo '${newProfile}' >> ~/.aws/config`))
    })

module.exports = {
  updateToken,
}
