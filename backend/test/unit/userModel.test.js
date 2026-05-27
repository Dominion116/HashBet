require("../setup");
const store = require("../../src/config/runtimeStore");

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("User model – runtime store delegation", () => {
  it("create() returns a user with an id", async () => {
    const User = require("../../src/models/User");
    const user = await User.create("0xusermodel00000000000000000000000001");
    expect(user).toBeDefined();
    expect(user.id || user._id).toBeTruthy();
  });

  it("create() normalises address to lowercase", async () => {
    const User = require("../../src/models/User");
    const user = await User.create("0xABCDEF0000000000000000000000000000001");
    expect(user.address).toBe("0xabcdef0000000000000000000000000000001");
  });

  it("create() returns same user on duplicate address", async () => {
    const User = require("../../src/models/User");
    const a = await User.create("0xusermodel00000000000000000000000002");
    const b = await User.create("0xusermodel00000000000000000000000002");
    const idA = String(a.id || a._id);
    const idB = String(b.id || b._id);
    expect(idA).toBe(idB);
  });

  it("findByAddress() returns undefined for unknown address", async () => {
    const User = require("../../src/models/User");
    const result = await User.findByAddress("0xnotexist000000000000000000000000001");
    expect(result).toBeFalsy();
  });

  it("findByAddress() finds user after create()", async () => {
    const User = require("../../src/models/User");
    await User.create("0xusermodel00000000000000000000000003");
    const found = await User.findByAddress("0xusermodel00000000000000000000000003");
    expect(found).toBeDefined();
    expect(found.address).toBe("0xusermodel00000000000000000000000003");
  });

  it("getStats() returns zero counts for new user", async () => {
    const User = require("../../src/models/User");
    const user = await User.create("0xusermodel00000000000000000000000004");
    const stats = await User.getStats(user.id || user._id);
    expect(stats.total_bets).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
  });
});
