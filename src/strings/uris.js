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

function getNameFromPath (filePath) {
  const fileName = filePath.split('/').slice(-1)[0]
  return fileName.endsWith('.md')
    ? fileName.split('.').slice(0, -1).join('.')
    : fileName
}

export { isValidUrl, pathWithoutTrail, getNameFromPath }
