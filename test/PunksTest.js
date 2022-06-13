const { expect } = require('chai');

describe('PunksTest', () => {
    const setup = async ({ maxSupply = 1000 }) => {
        const [owner] = await ethers.getSigners();
        const PlatziPunk = await ethers.getContractFactory('PlatziPunk');
        const deployed = await PlatziPunk.deploy(maxSupply);

        return {
            owner,
            deployed
        }
    }
    describe('deployment', () => {
        it('set max supply to passed param', async () => {
            const maxSupply = 4000;
            const { deployed } = await setup({ maxSupply });
            const supply = await deployed.maxSupply();
            expect(supply).to.equal(maxSupply);
        });
    });

    describe('minting', () => {
        it('mint tokens to owner', async () => {
            const { owner, deployed } = await setup({});
            await deployed.mint();
            const ownerOfMinted = await deployed.ownerOf(0);
            expect(ownerOfMinted).to.equal(owner.address);
        });

        it('Has a minting limit', async () => {
            const maxSupply = 2;
            const { deployed } = await setup({ maxSupply });

            //create tokens 
            await Promise.all([deployed.mint(), deployed.mint()]);

            //assert that the limit is reached
            await expect(deployed.mint()).to.be.revertedWith('Max supply reached');
        });
    });

    describe('token URI', () => {
        it('returns the correct URI', async () => {
            const { deployed } = await setup({});

            await deployed.mint();

            const tokenURI = await deployed.tokenURI(0);
            const stringTokenURI = await tokenURI.toString();
            const [, base64JSON] = stringTokenURI.split('data:application/json;base64,');
            const stringifiedMetadata = await Buffer.from(base64JSON, 'base64').toString('ascii');

            const metadata = JSON.parse(stringifiedMetadata);
            expect(metadata).to.have.all.keys("name", "description", "image");
        });
    });
});