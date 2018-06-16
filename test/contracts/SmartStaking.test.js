// const expectEvent = require('../helpers/expectEvent');
// const expectThrow = require('../helpers/expectThrow');
const assertRevert = require('../helpers/assertRevert');
const ether = require('../helpers/ether');

const BigNumber = web3.BigNumber;

const SmartStaking = artifacts.require('SmartStaking');

require('chai')
    .use(require('chai-as-promised'))
    .should();

function wait(ms) {
    var start = Date.now(), now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

contract('SmartStaking', function (accounts) {

    const [
      owner,
      recipient,
      anyone,
    ] = accounts;

    beforeEach(async function () {
        this.contract = await SmartStaking.new({ from: owner });
    });

    describe('ownership', function () {
        it('should have an owner', async function () {
          let owner_ = await this.contract.owner();
          assert.isTrue(owner_ !== 0);
        });
        
        it('changes owner after transfer', async function () {
          await this.contract.transferOwnership(anyone);
          let owner_ = await this.contract.owner();
        
          assert.isTrue(owner_ === anyone);
        });
    
        it('should prevent non-owners from transfering', async function () {
          const owner_ = await this.contract.owner.call();
          assert.isTrue(owner_ !== recipient);
          await assertRevert(this.contract.transferOwnership(recipient, { from: anyone }));
        });
    
        it('should guard ownership against stuck state', async function () {
          let originalOwner = await this.contract.owner();
          await assertRevert(this.contract.transferOwnership(null, { from: originalOwner }));
        });
    })

    describe('admin', function () {
        describe('non-admin cannot set/update packages information', function () {
            it('package1 information', async function () {
                await assertRevert(this.contract.setupPackage1(15, { from: anyone }));
            });

            it('package2 information', async function () {
                await assertRevert(this.contract.setupPackage2(25, { from: anyone }));
            });
            
            it('package3 information', async function () {
                await assertRevert(this.contract.setupPackage3(35, { from: anyone }));
            });
            
            it('package4 information', async function () {
                await assertRevert(this.contract.setupPackage4(45, { from: anyone }));
            });
        });

        describe('owner can set/update each package information', function () {
            it('package1 information', async function () {
                await this.contract.setupPackage1(15, { from: owner });
                const package = await this.contract.packages.call(1);
                assert.equal(package[1].toString(), 15);
            });

            it('package2 information', async function () {
                await this.contract.setupPackage2(25, { from: owner });
                const package = await this.contract.packages.call(2);
                assert.equal(package[1].toString(), 25);
            });

            it('package3 information', async function () {
                await this.contract.setupPackage3(35, { from: owner });
                const package = await this.contract.packages.call(3);
                assert.equal(package[1].toString(), 35);
            });

            it('package4 information', async function () {
                await this.contract.setupPackage4(45, { from: owner });
                const package = await this.contract.packages.call(4);
                assert.equal(package[1].toString(), 45);
            });
        });
    });

    describe('smart staking reward pool accept', function () {
        const value = ether(2);
        it('should accept payments', async function () {
            await this.contract.send(value).should.be.fulfilled;
        });

        it('should forward funds to wallet', async function () {
            await this.contract.sendTransaction({ value: value, from: owner }).should.be.fulfilled;
            const bonus = await this.contract.fundBonus.call();
            assert.equal(bonus.toString(), value);
        });

        it('should forward funds to wallet with data', async function () {
            await this.contract.sendTransaction({ value: value, data: '0x001', from: owner }).should.be.fulfilled;
            const bonus = await this.contract.fundBonus.call();
            assert.equal(bonus.toString(), value);
        });
    });

    describe('anyone can send fund to wallet to participate smart staking', function () {
        const reward = ether(10);
        const value = ether(1);

        describe('abnormal condition', function () {
            it('revert when withdraw on non-existing package', async function () {
                await assertRevert(this.contract.withdrawBonusPackage(100, {from: anyone }));
            });
    
            it('revert when withdraw on zero index of non-existing package', async function () {
                await assertRevert(this.contract.withdrawBonusPackage(0, {from: anyone }));
            });
    
            it('revert when withdraw on out-of-bound array index', async function() {
                // setup package 1, 1500 ~ 15%
                await this.contract.setupPackage1(1500, { from: owner });
    
                // deposit 10 NTY to reward pool
                await this.contract.sendTransaction({ value: reward, from: owner }).should.be.fulfilled;
                const bonus = await this.contract.fundBonus.call();
                assert.equal(bonus.toString(), reward);
                
                // send 1 NTY to participate smart staking's package 1
                // data: '0x0000000000000000000000000000000000000000000000000000000000000001'
                await this.contract.sendTransaction({
                    value: value,
                    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
                    from: anyone
                }).should.be.fulfilled;
    
                await assertRevert(this.contract.withdrawBonusPackage(1, {from: anyone }));
            });
        });

        describe('normal condition', function () {
            it('accept payment to allow sender to participate smart staking', async function () {
                // setup package 1, 1500 ~ 15%
                await this.contract.setupPackage1(1500, { from: owner });
    
                // deposit 10 NTY to reward pool
                await this.contract.sendTransaction({ value: reward, from: owner }).should.be.fulfilled;
                const bonus = await this.contract.fundBonus.call();
                assert.equal(bonus.toString(), reward);
                
                // send 1 NTY to participate smart staking's package 1
                // data: '0x0000000000000000000000000000000000000000000000000000000000000001'
                await this.contract.sendTransaction({
                    value: value,
                    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
                    from: anyone
                }).should.be.fulfilled;
    
                // check reward pool after smart staking
                const bonusAfter = await this.contract.fundBonus.call();
                const rate = new BigNumber(15);
                const expect = reward.sub(rate.mul(value).div(100));
                assert.equal(bonusAfter.toString(), expect.toString());
    
                // check total fund, for the beginning it should be equal to value
                const fund = await this.contract.fund.call();
                assert.equal(fund.toString(), value.toString());
    
                // package count of anyone should be 1
                const packageCount = await this.contract.getPackageCount({ from: anyone });
                assert.equal(packageCount.toString(), 1);
    
                // check package information
                const package = await this.contract.getPackageInfo(0, { from: anyone });
                assert.equal(package[0], false);
                assert.equal(package[1].toString(), value.toString());            
            });
    
            it('participate smart staking then withdraw', async function () {
                // setup package 1, 2500 ~ 25%
                await this.contract.setupPackage2(2500, { from: owner });
    
                // deposit 10 NTY to reward pool
                await this.contract.sendTransaction({ value: reward, from: owner }).should.be.fulfilled;
                const bonus = await this.contract.fundBonus.call();
                assert.equal(bonus.toString(), reward);
    
                // send 1 NTY to participate smart staking's package 2
                // data: '0x0000000000000000000000000000000000000000000000000000000000000002'
                await this.contract.sendTransaction({
                    value: value,
                    data: '0x0000000000000000000000000000000000000000000000000000000000000002',
                    from: anyone
                }).should.be.fulfilled;
    
                // check reward pool after smart staking
                const bonusAfter = await this.contract.fundBonus.call();
                const rate = new BigNumber(25);
                const expect = reward.sub(rate.mul(value).div(100));
                assert.equal(bonusAfter.toString(), expect.toString());
    
                // check total fund, for the beginning it should be equal to value
                const fund = await this.contract.fund.call();
                assert.equal(fund.toString(), value.toString());
    
                // package count of anyone should be 1
                const packageCount = await this.contract.getPackageCount({ from: anyone });
                assert.equal(packageCount.toString(), 1);
    
                const package = await this.contract.getPackageInfo(0, { from: anyone });
                assert.equal(package[0], false);
                assert.equal(package[1].toString(), value.toString());
    
                // wait 4+ minutes then withdraw
                wait(250000);
                this.contract.withdrawBonusPackage(0, { from: anyone });
                const packageAfterWithdraw = await this.contract.getPackageInfo(0, { from: anyone });
                assert.equal(packageAfterWithdraw[0], true);
            });
        });
    });
});
