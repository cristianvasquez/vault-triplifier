// /foo/bar/name.md -> name
// /foo/bar/name -> name
// /foo/bar/img.png -> img.png
function getNameFromPath (filePath) {
  const fileName = filePath.split('/').slice(-1)[0]
  return fileName.endsWith('.md')
    ? fileName.split('.').slice(0, -1).join('.')
    : fileName
}

// ./hello -> hello
function pathWithoutTrail (path) {
  return path.startsWith('./') ? path.replace(/^.\//, '') : path
}

function isHTTP (urlString) {
  try {

    if (!(urlString.startsWith('http'))) {
      return false
    }

    return Boolean(new URL(urlString))
  } catch (e) {
    return false
  }
}

export { getNameFromPath, pathWithoutTrail, isHTTP }
