# lime-test-00 ~ library contract

Contract for a book library with the following requirements:

- The administrator (owner) of the library should be able to add new books and the number of copies in the library.
- Users should be able to see the available books and borrow them by their id.
- Users should be able to return books.
- A user should not borrow more than one copy of a book at a time. The users should not be able to borrow a book more times than the copies in the libraries unless the copy is returned.
- Everyone should be able to see the addresses of all people that have ever borrowed a given book.

To reproduce test run:

```shell
yarn install
npx hardhat compile
npx hardhat test
```
