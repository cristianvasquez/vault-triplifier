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

function isDelimitedURI (value) {
  if (typeof value !== 'string') {
    return false
  }
  
  // Check if value is wrapped in angle brackets
  if (value.startsWith('<') && value.endsWith('>')) {
    const uri = value.slice(1, -1) // Remove < and >
    
    // Basic URI validation - should contain a scheme
    try {
      new URL(uri)
      return true
    } catch (e) {
      // If URL constructor fails, check for other URI schemes
      return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(uri)
    }
  }
  
  return false
}

function extractDelimitedURI (value) {
  if (isDelimitedURI(value)) {
    return value.slice(1, -1) // Remove < and >
  }
  return null
}

export { getNameFromPath, pathWithoutTrail, isHTTP, isDelimitedURI, extractDelimitedURI }
