import rdf from 'rdf-ext'

const ns = {
  rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: rdf.namespace('http://schema.org/'),
  xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#'),
  rdfs: rdf.namespace('http://www.w3.org/2000/01/rdf-schema#'),
  ex: rdf.namespace('http://example.org/'),
  dot: rdf.namespace('http://pending.org/dot/'),
  osg: rdf.namespace('http://pending.org/osg/'),
  prov: rdf.namespace('http://www.w3.org/ns/prov#'),
  lpd: rdf.namespace('http://www.w3.org/ns/ldp#'),
  oa: rdf.namespace('http://www.w3.org/ns/oa#'),
}
export default ns
