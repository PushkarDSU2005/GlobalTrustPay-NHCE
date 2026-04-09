// No toolbox required just for basic compilation

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: "./src/contracts/artifacts",
    cache: "./src/contracts/cache",
  }
};
