import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

function whenFactory(passedPath, continueChain) {
  const pathScheme = parseScheme(passedPath)

  if (pathScheme.target !== 'state' && pathScheme.target !== 'input') {
    throw new Error('Cerebral operator WHEN - The path: "' + passedPath + '" does not target "input" or "state"')
  }

  // define the action
  const when = function({input, state, path}) {
    const pathValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))
    let value

    if (pathScheme.target === 'input') {
      value = input[pathValue]
    } else if (pathScheme.target === 'state') {
      value = state.get(pathValue)
    }

    return Boolean(value) ? path.accepted() : path.discarded()
  }

  when.displayName = `operator WHEN (${passedPath})`

  return [
    when, {
      accepted: continueChain,
      discarded: []
    }
  ]
}

export default whenFactory