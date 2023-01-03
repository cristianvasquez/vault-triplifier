function isValidUrl (urlString) {
  try {
    return Boolean(new URL(urlString))
  } catch (e) {
    return false
  }
}

function pathWithoutTrail (path) {
  return path.startsWith('./') ? path.replace(/^.\//, '') : path
}

export { isValidUrl, pathWithoutTrail }
