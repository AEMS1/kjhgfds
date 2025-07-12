let adminContract;

window.onload = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  if (address !== "0xec54951C7d4619256Ea01C811fFdFa01A9925683") {
    alert("Access Denied");
    document.body.innerHTML = "";
    return;
  }

  adminContract = new ethers.Contract("0xab8cbbba46ebc7ae38b6be977b774f3dc42c4262", AUCTION_ABI, signer);
};

async function updateEntryFee() {
  const fee = document.getElementById("entryFeeInput").value;
  const val = ethers.parseUnits(fee, 18);
  await adminContract.setEntryFee(val);
}

async function setReward(days) {
  const val = document.getElementById(`reward${days}Input`).value;
  await adminContract.setReward(days, ethers.parseUnits(val, 18));
}

async function setMinimums() {
  const min30 = ethers.parseEther(document.getElementById("min30").value);
  const min60 = ethers.parseEther(document.getElementById("min60").value);
  await adminContract.setMinimumBNB(30, min30);
  await adminContract.setMinimumBNB(60, min60);
}

async function resetAuction(days) {
  await adminContract.resetAuction(days);
}
