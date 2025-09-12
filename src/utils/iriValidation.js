/**
 * Validates and encodes URLs to ensure they are valid IRIs according to RFC 3987.
 * 
 * This function handles common invalid characters in URLs by percent-encoding them:
 * - Pipe character (|) -> %7C
 * - Space character ( ) -> %20
 * - Square brackets ([]) -> %5B, %5D
 * - Curly braces ({}) -> %7B, %7D
 * 
 * @param {string} url - The URL to validate and encode
 * @returns {string} - The encoded URL that is valid as an IRI
 */
export function encodeAsValidIri(url) {
  // Characters that need to be encoded to make a valid IRI
  const invalidChars = {
    '|': '%7C',   // Pipe character
    ' ': '%20',   // Space character
    '[': '%5B',   // Left square bracket
    ']': '%5D',   // Right square bracket
    '{': '%7B',   // Left curly brace
    '}': '%7D'    // Right curly brace
  }
  
  let encodedUrl = url
  
  // Replace each invalid character with its encoded equivalent
  for (const [char, encoded] of Object.entries(invalidChars)) {
    encodedUrl = encodedUrl.replaceAll(char, encoded)
  }
  
  return encodedUrl
}

/**
 * Validates if a string is a valid IRI by attempting to create a URL object
 * and checking for common invalid characters.
 * 
 * @param {string} iri - The IRI string to validate
 * @returns {boolean} - True if the IRI is valid, false otherwise
 */
export function isValidIri(iri) {
  try {
    // Basic URL validation
    new URL(iri)
    
    // Check for invalid IRI characters that would cause issues with RDF processors
    const invalidChars = /[|[\]{}]/
    return !invalidChars.test(iri)
  } catch {
    // If URL constructor throws, it's not a valid IRI
    return false
  }
}