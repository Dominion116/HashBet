// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);
}

/**
 * @title HashBet
 * @dev Provably fair game on Celo blockchain
 * Players predict if first char of next block hash is Big (8-F) or Small (0-7)
 */

contract HashBet {
    // Constants
    uint256 public constant WIN_MULTIPLIER = 188; // 1.88x in basis points
    uint256 public constant HOUSE_EDGE_BPS = 600; // 6%
    uint256 public constant MAX_BET = 0.1 ether;
    uint256 public constant MIN_BET = 0.02 ether;

    // Structs
    struct Bet {
        address player;
        uint256 amount;
        bool isBig;
        uint256 blockNumber;
        bytes32 blockHash;
        bool settled;
        bool won;
        uint256 timestamp;
    }

    // State
    address public owner;
    address public immutable paymentToken;
    string public paymentTokenSymbol;
    uint256 public totalPool;
    uint256 public totalBetsPlaced;
    uint256 public totalBetsWon;

    mapping(uint256 => Bet) public bets;
    mapping(address => uint256[]) public playerBets;

    // Events
    event BetPlaced(
        uint256 indexed betId,
        address indexed player,
        uint256 amount,
        bool isBig,
        uint256 blockNumber
    );

    event BetSettled(
        uint256 indexed betId,
        address indexed player,
        bool won,
        uint256 payout
    );

    event PoolFunded(address indexed funder, uint256 amount);
    event PoolWithdrawn(address indexed owner, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _paymentToken, string memory _paymentTokenSymbol) {
        require(_paymentToken != address(0), "Token required");
        owner = msg.sender;
        paymentToken = _paymentToken;
        paymentTokenSymbol = _paymentTokenSymbol;
    }

    /**
     * @dev Place a bet
     * @param _isBig true if betting on Big (8-F), false for Small (0-7)
     */
    function placeBet(bool _isBig, uint256 betAmount) external {
        require(betAmount >= MIN_BET, "Bet too small");
        require(betAmount <= MAX_BET, "Bet too large");
        require(totalPool >= betAmount * WIN_MULTIPLIER / 100, "Insufficient pool");
        require(IERC20(paymentToken).transferFrom(msg.sender, address(this), betAmount), "Token transfer failed");

        uint256 betId = totalBetsPlaced++;
        bets[betId] = Bet({
            player: msg.sender,
            amount: betAmount,
            isBig: _isBig,
            blockNumber: block.number + 1,
            blockHash: bytes32(0),
            settled: false,
            won: false,
            timestamp: block.timestamp
        });

        playerBets[msg.sender].push(betId);
        totalPool += betAmount;

        emit BetPlaced(betId, msg.sender, betAmount, _isBig, block.number + 1);
    }

    /**
     * @dev Settle a bet using the block hash
     * @param _betId The bet ID to settle
     */
    function settleBet(uint256 _betId) external {
        Bet storage bet = bets[_betId];
        require(!bet.settled, "Already settled");
        require(block.number > bet.blockNumber, "Block not mined yet");

        // Get the block hash
        bytes32 blockHash = blockhash(bet.blockNumber);
        require(blockHash != bytes32(0), "Block hash unavailable");

        bet.blockHash = blockHash;
        bet.settled = true;

        // Extract first hex char (first 4 bits)
        uint8 firstChar = uint8(blockHash[0]) >> 4;
        bool isBig = firstChar >= 8;

        bool won = isBig == bet.isBig;
        bet.won = won;

        uint256 payout = 0;
        if (won) {
            payout = (bet.amount * WIN_MULTIPLIER) / 100;
            uint256 houseCut = (payout * HOUSE_EDGE_BPS) / 10000;
            uint256 playerPayout = payout - houseCut;

            require(totalPool >= playerPayout, "Insufficient pool");
            totalPool -= playerPayout;
            totalBetsWon++;

            require(IERC20(paymentToken).transfer(bet.player, playerPayout), "Payout failed");

            emit BetSettled(_betId, bet.player, true, playerPayout);
        } else {
            emit BetSettled(_betId, bet.player, false, 0);
        }
    }

    /**
     * @dev Fund the pool
     */
    function fundPool(uint256 amount) external {
        require(amount > 0, "Amount required");
        require(IERC20(paymentToken).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        totalPool += amount;
        emit PoolFunded(msg.sender, amount);
    }

    /**
     * @dev Withdraw from pool (owner only)
     */
    function withdrawFromPool(uint256 amount) external onlyOwner {
        require(amount <= totalPool, "Insufficient pool");
        totalPool -= amount;
        require(IERC20(paymentToken).transfer(owner, amount), "Withdrawal failed");
        emit PoolWithdrawn(owner, amount);
    }

    /**
     * @dev Get player's bets
     */
    function getPlayerBets(address player) external view returns (uint256[] memory) {
        return playerBets[player];
    }

    /**
     * @dev Get bet details
     */
    function getBetDetails(uint256 betId)
        external
        view
        returns (
            address player,
            uint256 amount,
            bool isBig,
            bool settled,
            bool won
        )
    {
        Bet memory bet = bets[betId];
        return (bet.player, bet.amount, bet.isBig, bet.settled, bet.won);
    }
}
