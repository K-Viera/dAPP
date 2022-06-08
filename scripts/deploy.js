const deploy = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with the account:", deployer.address);

    const PlatziPunk = await ethers.getContractFactory("PlatziPunk");
    const deployed = await PlatziPunk.deploy();

    console.log("platzi punk deploted at:", deployed.address);
 };

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })