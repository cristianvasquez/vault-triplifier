import { strict as assert } from 'assert';
import { readFile } from 'fs/promises';
import { triplifyFile } from '../index.js';
import ns from '../src/namespaces.js';
import rdf from 'rdf-ext';

describe('Declarative Mappings', () => {
  it('should apply mappings from a JSON file', async () => {
    const mappingsJson = await readFile('test/support/declarative-mappings.json', 'utf8');
    const mappings = JSON.parse(mappingsJson);
    
    const options = {
      includeLabelsFor: ['documents', 'sections', 'properties'],
      partitionBy: ['header'],
      mappings,
    };

    const pointer = await triplifyFile('./example-vault/WhiteRabbit.md', options);
    const dataset = pointer.dataset;

    // Expected triples
    const whiteRabbitBlockNode = [...dataset].find(quad =>
      quad.predicate.equals(ns.rdfs.label) &&
      quad.object.value === 'White rabbit' &&
      quad.subject.termType === 'BlankNode'
    )?.subject;

    assert(whiteRabbitBlockNode, 'White rabbit block node not found');
    const wozenderlandsUri = rdf.namedNode('urn:resource:Wozenderlands');

    const typeRabbitTriple = rdf.quad(whiteRabbitBlockNode, ns.rdf.type, rdf.namedNode('http://example.org/Rabbit'));
    const addressWozenderlandsTriple = rdf.quad(whiteRabbitBlockNode, ns.schema.address, wozenderlandsUri);

    // Assertions
    console.log(dataset.toString());
    assert(dataset.has(typeRabbitTriple), 'Missing rdf:type ex:Rabbit triple');
    assert(dataset.has(addressWozenderlandsTriple), 'Missing schema:address Wozenderlands triple');
  });
});
