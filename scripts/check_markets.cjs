const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846";
  const market = await ethers.getContractAt("AiraMarketProtocol", contractAddress);
  const count = await market.marketCount();
  console.log("marketCount():", count.toString());
  const markets = await market.listMarkets();
  console.log("listMarkets().length:", markets.length);
  for (let i = 1; i <= Number(count); i++) {
    const m = await market.getMarket(i);
    console.log(`Market #${i}:`, m.title, "Category:", m.category);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
