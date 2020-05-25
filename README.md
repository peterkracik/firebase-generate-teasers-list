# firebase-generate-teasers-list

[blog post](https://medium.com/@peterkracik/my-approach-to-structure-firestore-without-exploding-the-budget-b5633e4f6dd7)

Example firebase function to generate and update teasers list from documents,
it will generate array of all __Post__ documents inside the document __teasers/posts__

then in you JS file you request only one document to get the whole list, which will save you
numbers of requests and maybe money

```typescript
getAllPosts(): Observable<Post[]> {
    return this.db.doc('teasers/posts').get().pipe(
      map( (value:any) => value.all as Post[] )
    );
}
```

