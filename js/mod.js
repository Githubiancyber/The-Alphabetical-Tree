let modInfo = {
  name: "The Alphabetical Tree",
  id: "alphabet",
  author: "Five Hargreeves#9676",
  pointsName: "Alphabetics",
  discordName: "",
  discordLink: "",
  changelogLink:
    "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
  initialStartPoints: new Decimal(10), // Used for hard resets and new players

  offlineLimit: 1 // In hours
};

// Set your version in num and name
let VERSION = {
  num: "2.0",
  name: "B is for Barcode"
};

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"];

function getStartPoints() {
  return new Decimal(modInfo.initialStartPoints);
}

// Determines if it should show points/sec
function canGenPoints() {
  return true;
}

// Calculate points/sec!
function getPointGen() {
  if (!canGenPoints()) return new Decimal(0);

   let gain = new Decimal(1).times(layers["a"].effect().add(1)).times(layers["b"].effect().add(1));
  if (hasUpgrade("a", 11)) gain = gain.times(upgradeEffect("a", 11));
  if (hasUpgrade("a", 13)) gain = gain.times(upgradeEffect("a", 13));
  gain = gain.mul(buyableEffect("a", 11));
  if (inChallenge("a", 11)) gain = gain.pow(0.5);
  if (hasChallenge("a", 11)) gain = gain.pow(1.2);
  return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
  return {};
}

// Display extra things at the top of the page
var displayThings = [];

// Determines when the game "ends"
function isEndgame() {
  return player.points.gte(new Decimal("e280000000"));
}

// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
  return 3600; // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {}
