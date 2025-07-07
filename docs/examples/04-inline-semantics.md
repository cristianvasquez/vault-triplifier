# Inline Semantics

Embed semantic properties naturally within sentences using parenthetical syntax for fluid, readable documents.

## The Inline Syntax

Instead of separating semantic properties from your prose, embed them directly using parentheses:

```markdown
# Natural Prose with Embedded Semantics

Alice (is a :: Person) (age :: 25) lives in (location :: [[Wonderland]]) where she 
(studies :: magic) and (works as :: student researcher). She (knows :: [[Bob]]) 
who (is a :: Person) (age :: 27) and works at (organization :: [[Oxford University]]).

The White Rabbit (is a :: Character) (species :: rabbit) (wears :: pocket watch) 
is always (status :: running late) for (appointment :: tea party).
```

## How It Works

- **Parentheses** `()` contain the semantic property
- **Double colon** `::` separates property from value inside parentheses
- **Properties attach** to the content block containing the parentheses
- **Reading flow** remains natural and uninterrupted

## Basic Inline Patterns

### Character Descriptions
```markdown
Alice (schema:name :: Alice Wonderland) (schema:age :: 25) is a curious girl who 
fell down a rabbit hole into (place :: [[Wonderland]]) where she met the 
Mad Hatter (schema:name :: Hatter) (occupation :: hat maker) (personality :: eccentric).
```

### Event Narratives
```markdown
The tea party (schema:startTime :: 3:00 PM) (schema:location :: [[Hatter's House]]) 
was attended by Alice (role :: guest), the Mad Hatter (role :: host), and the 
March Hare (species :: hare) (mood :: excited).
```

### Location Descriptions
```markdown
Wonderland (schema:type :: fictional place) (climate :: variable) contains many 
wonders including the Queen's Garden (features :: talking flowers) (danger level :: high) 
and the Caterpillar's Mushroom (properties :: size-changing) (color :: blue and red).
```

## Advanced Inline Patterns

### Multiple Properties in Sequence
```markdown
The Cheshire Cat (species :: cat) (ability :: disappearing) (personality :: mysterious) 
(famous for :: grin) appeared to Alice and offered (advice :: "We're all mad here") 
(tone :: philosophical) (helpfulness :: questionable).
```

### Nested Relationships
```markdown
Alice met Bob (relationship :: friend) (duration :: 5 years) (met at :: [[Oxford]]) 
who introduced her to Professor Smith (title :: Dr.) (department :: Philosophy) 
(expertise :: logic) (teaches :: [[Critical Thinking Course]]).
```

### Temporal Context
```markdown
When Alice (age :: 7) first read about Wonderland (year :: 2005) (source :: library book), 
she (emotion :: fascinated) dreamed about visiting (frequency :: nightly) 
(dream content :: falling down rabbit holes).
```

## Mixing Inline and Block Properties

Combine inline semantics with traditional block properties:

```markdown
# Alice's Adventure

Alice (schema:age :: 25) (schema:occupation :: student) was walking through 
Oxford (location type :: city) when she spotted a White Rabbit (species :: rabbit) 
(notable feature :: pocket watch) running past.

# Additional character details
full name :: Alice Wonderland
university :: [[Oxford University]]
favorite subject :: Philosophy
current status :: lost in Wonderland

She followed the rabbit down a hole (depth :: unknown) (leads to :: [[Wonderland]]) 
and found herself in a strange new world (physics :: non-Euclidean) 
(inhabitants :: talking animals).
```

## Conversational Semantics

Add semantic meaning to dialogue and interactions:

```markdown
# Tea Party Conversation

"I'm late!" exclaimed the White Rabbit (speaker :: White Rabbit) (emotion :: panic) 
(reason :: appointment with Queen) (time :: 4:00 PM).

"Wait!" called Alice (speaker :: Alice) (action :: pursuing) (motivation :: curiosity) 
(current location :: [[Rabbit Hole]]).

The Mad Hatter (speaker :: Mad Hatter) (context :: tea party) (participants :: Alice, March Hare) 
said, "Have some tea" (offer :: tea) (social context :: unbirthday party) 
(politeness :: questionable).
```

## Scientific and Technical Content

Use inline semantics for technical documentation:

```markdown
# Wonderland Physics

In Wonderland, objects (behavior :: size-changing) (trigger :: eating/drinking) 
can grow or shrink based on consumption of certain items (substance :: growth potion) 
(effect :: enlargement) (duration :: temporary) or (substance :: shrinking cake) 
(effect :: reduction) (safety :: questionable).

The Cheshire Cat's grin (phenomenon :: persistence without body) (duration :: indefinite) 
defies normal physics (violation :: conservation of matter) but follows 
Wonderland logic (principle :: impossibility is possible).
```

## Research and Citations

Embed semantic metadata in academic writing:

```markdown
# Literature Review

Carroll's "Alice's Adventures in Wonderland" (publication year :: 1865) 
(genre :: children's literature) (themes :: coming of age, absurdism) 
influenced many later works including "Through the Looking-Glass" 
(sequel :: true) (publication year :: 1871) (themes :: chess, mirror worlds).

Recent scholarship by Johnson (year :: 2023) (methodology :: textual analysis) 
(focus :: mathematical symbolism) argues that the tea party scene 
(chapter :: A Mad Tea-Party) (significance :: social critique) represents 
Victorian anxieties about (topic :: social conventions) (evidence :: dialogue patterns).
```

## Data and Measurements

Inline semantics work well for quantitative content:

```markdown
# Wonderland Measurements

Alice's height varied dramatically during her adventure: initially (height :: 4.5 feet) 
(measurement date :: arrival), she grew to (height :: 9 feet) (cause :: growth potion) 
(duration :: 10 minutes) before shrinking to (height :: 3 inches) (cause :: shrinking cake) 
(emotional state :: terrified).

The Rabbit Hole has a diameter of (width :: 3 feet) (depth :: unmeasurable) 
(access method :: falling) (estimated fall time :: 5 minutes) (landing :: soft) 
(destination :: [[Wonderland Hall]]).
```

## Emotional and Psychological Content

Capture subjective experiences semantically:

```markdown
# Alice's Emotional Journey

Alice felt (emotion :: confusion) (intensity :: high) when she first saw 
the White Rabbit (trigger :: talking animal) (previous experience :: none) 
(reaction :: followed anyway) (emotion :: curiosity) (strength :: overwhelming).

At the tea party, Alice experienced (emotion :: frustration) (cause :: riddles without answers) 
(coping strategy :: politeness) (internal state :: wanting to leave) 
(social pressure :: staying) (duration :: 30 minutes).
```

## Multiple Perspectives

Document different viewpoints inline:

```markdown
# The Tea Party Incident

From Alice's perspective (viewpoint :: guest), the tea party was (experience :: confusing) 
(reason :: nonsensical riddles) (social dynamics :: unwelcoming) (desire :: escape).

The Mad Hatter's view (viewpoint :: host) was different: the party was (experience :: normal) 
(reason :: always teatime) (social dynamics :: friendly) (puzzlement :: Alice's confusion).

The March Hare (viewpoint :: co-host) (mental state :: excited) found everything 
(experience :: delightful) (reason :: loves riddles) (social role :: entertainment).
```

## Best Practices

### Keep Reading Flow Natural
```markdown
# Good - flows naturally
Alice (age :: 25) walked through the forest (location :: Wonderland Woods) 
and met a cat (species :: Cheshire Cat) with a mysterious grin.

# Avoid - disrupts reading
Alice (schema:Person) (hasAge :: 25) (performsAction :: walking) walked through 
the (schemaPlace) forest (locatedIn :: Wonderland) (hasName :: Woods).
```

### Use Meaningful Properties
```markdown
# Good - semantic meaning
Alice (emotional state :: curious) approached the door (size :: tiny) 
(requires :: shrinking) (leads to :: garden).

# Avoid - redundant with text
Alice (action :: approached) approached the door (object :: door) 
(action description :: approaching).
```

### Balance Inline and Block
```markdown
# Good balance
Alice (age :: 25) lived in Oxford where she studied philosophy.

# Block properties for detailed info
university :: [[Oxford University]]
degree :: Bachelor of Philosophy
graduation year :: 2024
thesis topic :: Logic in Literature

# More inline narrative
She often visited the library (favorite spot :: reading room) 
(preferred time :: afternoon) (activity :: research).
```

## What Gets Generated

When you write:

```markdown
Alice (schema:age :: 25) knows Bob (relationship :: friend) who lives in 
(place :: [[Oxford]]).
```

The RDF attaches properties to the containing block:

```turtle
<file:///current-document> <http://schema.org/age> "25" ;
    <http://example.org/relationship> "friend" ;
    <http://example.org/place> <file:///Oxford> .
```

## Next Steps

Learn about [Document Partitioning](05-document-partitioning.md) to control how your documents are divided into semantic sections.

## Practice Exercise

Rewrite this basic description using inline semantics:

```markdown
# Basic Version
Alice is 25 years old. She is a student. She knows Bob. Bob is 27 years old. 
Bob works at Oxford University.

# Your Inline Version
Alice (age :: ?) is a (occupation :: ?) who knows Bob (age :: ?) 
who works at (organization :: ?).
```

Make it flow naturally while capturing all the semantic information!