// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Access control
import "@openzeppelin/contracts/access/Ownable.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// * Library requirements:
// - The administrator (owner) of the library should be able to add new books and the number of copies in the library.
// - Users should be able to see the available books and borrow them by their id.
// - Users should be able to return books.
// - A user should not borrow more than one copy of a book at a time. The users should not be able to borrow a book more times than the copies in the libraries unless copy is returned.
// - Everyone should be able to see the addresses of all people that have ever borrowed a given book.

contract Library is Ownable {
    struct Book {
        string isbn;
        string name;
        uint256 copies;
        uint256 borrowed;
    }

    mapping(string => Book) public books;
    string[] public bookIds;
    mapping(address => mapping(string => bool)) public borrowedBook;
    address[] public borrowersHistory;

    event NewBookAdded(string name, uint256 count);

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function addBook(
        string memory _isbn,
        string memory _name,
        uint256 _copies
    ) public onlyOwner {
        Book storage _book = books[_isbn];
        require(compareStrings(_book.isbn, ""), "isbn already registered");
        books[_isbn].isbn = _isbn;
        books[_isbn].name = _name;
        books[_isbn].copies = _copies;
        books[_isbn].borrowed = 0;
        bookIds.push(_isbn);
        emit NewBookAdded(_name, _copies);
    }

    function borrowBook(string[] memory _isbns) public {
        for (uint256 x = 0; x < _isbns.length; x++) {
            Book storage _book = books[_isbns[x]];
            require(_book.borrowed < _book.copies, "copy not available");
            _book.borrowed += 1;
            borrowedBook[msg.sender][_book.isbn] = true;
        }
        borrowersHistory.push(msg.sender);
    }

    function returnBook(string[] memory _isbns) public {
        for (uint256 x = 0; x < _isbns.length; x++) {
            Book storage _book = books[_isbns[x]];
            require(
                borrowedBook[msg.sender][_book.isbn],
                "not borrowed by user"
            );
            require(_book.borrowed > 0, "not borrowed by anyone");
            _book.borrowed -= 1;
            borrowedBook[msg.sender][_book.isbn] = false;
        }
    }
}
