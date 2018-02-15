#!/usr/bin/env node

import { argv } from 'yargs'
import lib from '../lib'

const {
  token,
  profile,
  mfaProfile,
  region,
  serialNumber,
} = argv

const usage = () => {
  console.log(`
Usage:

  aws-mfa-token --token <token>

Will add the mfa token to ~/.aws/config
`)
}

if (token) {
  lib.updateToken(token, profile, serialNumber, region, mfaProfile)
} else {
  usage()
}
