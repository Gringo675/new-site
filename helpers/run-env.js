import { spawn } from 'node:child_process'

const args = process.argv.slice(2)
let cmdIndex = 0

// Parse all leading KEY=VALUE arguments
for (let i = 0; i < args.length; i++) {
  const match = args[i].match(/^([A-Za-z0-9_]+)=(.*)$/)
  if (match) {
    process.env[match[1]] = match[2]
  } else {
    cmdIndex = i
    break
  }
}

const commandArgs = args.slice(cmdIndex)

if (commandArgs.length === 0) {
  console.error('[run-env] Error: No command specified.')
  process.exit(1)
}

// In Node 24+, passing args array with shell: true triggers DEP0190.
// Passing a single command string avoids the deprecation warning.
const commandLine = commandArgs.map(arg => (arg.includes(' ') && !arg.startsWith('"') ? `"${arg}"` : arg)).join(' ')

const child = spawn(commandLine, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  } else {
    process.exit(code ?? 0)
  }
})
