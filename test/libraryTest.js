const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Library - Lime Test", function () {

  let [admin, user1] = ['', '', ''];
  let Library;
  let library;

  it("1. Contract should be deployed", async () => {
    [admin, user1] = await ethers.getSigners();
    Library = await ethers.getContractFactory("Library");
    library = await Library.deploy();
    await library.deployed();
  });

  it("2. Administrator should be added on contract deployment", async function () {
    let adminAddress = await admin.getAddress();
    let libraryAdmin = await library.owner();
    assert(adminAddress === libraryAdmin, "deployment error");
  });

  it("3. Admin should add a new book to the library", async function () {
    await library.connect(admin).addBook("ISBN_01", "Book 1", 2);
    await library.connect(admin).addBook("ISBN_02", "Book 2", 5);
    let newBookAdded = await library.books("ISBN_01");
    assert(newBookAdded.name === "Book 1", "book not added");
  });

  it("4. User should not be able to add a new book to the library", async function () {
    try {
      await library.connect(user1).addBook("ISBN_03", "Book 3", 1);
    } catch (e) {
      assert(e.message.includes("caller is not the owner"));
      return;
    }
    assert(false);
  });

  it("5. User should be able to borrow a book", async function () {
    await library.connect(user1).borrowBook(["ISBN_01", "ISBN_02"]);
    let bookBorrowed = await library.books("ISBN_01");
    let userAddress = await user1.getAddress();
    let isBorrowed = await library.borrowedBook(userAddress, "ISBN_01");
    assert(bookBorrowed.borrowed > 0, "borrow not incremented in book");
    assert(isBorrowed, "borrow not incremented in borrowers");
  });

  it("6. User should be able to return a borrowed book", async function () {
    await library.connect(user1).returnBook(["ISBN_02"]);
    let userAddress = await user1.getAddress();
    let isBorrowed = await library.borrowedBook(userAddress, "ISBN_02");
    assert(!isBorrowed, "borrow not decreased in borrowers");
  });

  it("7. User should be able to see the addresses of all people that have ever borrowed a given book", async function () {
    let userAddress = await user1.getAddress();
    let lastBorrower = await library.connect(user1).borrowersHistory(0);
    assert(userAddress === lastBorrower, "address not added in borrowersHistory");   
  });

});
