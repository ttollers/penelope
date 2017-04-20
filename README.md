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

