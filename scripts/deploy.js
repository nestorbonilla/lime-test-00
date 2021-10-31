const hre = require("hardhat");

async function main() {

  const Library = await hre.ethers.getContractFactory("Library");
  const library = await Library.deploy();

  await library.deployed();

  console.log("Library deployed to:", library.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
