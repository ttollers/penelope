# Penelope

Penelope searchs through blocks of text and looks for locations so that content can be mapped.

```
penelope.getLocations(["Wandsworth"], ["Some content that talks about a place called Wandsworth"]);
```

Can be used with 50,000+ locations and large arrays of text.
 
The locations array should be inversely sorted according to string length. This means that, for example, Stratford Upon Avon will always match over Stratford where appropriate.

An array of locations can be sorted using:

```
penelope.orderLocationsByLength(array);
```

Penelope is a short term fix for more mature NLP solutions. It looks at words before and after the matched location to more accurately establish that it's not a persons name or road name or any other use the word may have.
