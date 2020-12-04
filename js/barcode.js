addLayer("b", {
  branches: ["a"],
  name: "Barcode", // This is optional, only used in a few places, If absent it just uses the layer id.
  symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: true,
      unlocked2: new Decimal(0),
      points: new Decimal(0),
      best: new Decimal(0)
    };
  },
  effect() {
    return new Decimal(player.b.points)
      .add(1)
      .log(14)
      .add(0.5)
      .times(2);
  },
  effectDescription() {
    return (
      "This is boosting Ability Gain by " + format(layers[this.layer].effect())
    );
  },
  nodeStyle: {
    background: "linear-gradient(to right, black, white, black", // red, orange, yellow, green, blue, indigo, violet
    "background-origin": "border-box"
  },
  tabFormat: {
    Upgrades: {
      content: [
        "main-display",
        ["prestige-button", ""],
        function() {
          return hasUpgrade("b", 22) ? { display: "none" } : {};
        },
        "blank",
        "milestones",
        "upgrades"
      ]
    },
    Buyables: {
      content: ["main-display", ["prestige-button", ""], "blank", "buyables"]
    },
    Challenges: {
      content: ["main-display", ["prestige-button", ""], "blank", "challenges"]
    }
  },
  resetsNothing() {
    return hasMilestone("b", 0);
  },
  onPrestige() {
    (player.points = new Decimal(0)), (player.a.points = new Decimal(0));
  },
  color: "#ffffff",
  requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
  resource: "Barcode", // Name of prestige currency
  baseResource: "ability", // Name of resource prestige is based on
  baseAmount() {
    return player.a.points;
  }, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 0.5, // Prestige currency exponent
  gainMult() {
    // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1);
    if (hasUpgrade("b", 14)) mult = mult.times(upgradeEffect("b", 14));
    mult = mult.mul(buyableEffect(this.layer, 11));
    mult = mult.mul(buyableEffect("a", 13));
    return mult;
  },
  gainExp() {
    // Calculate the exponent on main currency from bonuses
    return new Decimal(1);
  },
  milestones: {
    0: {
      requirementDescription: "1 Barcode",
      effectDescription: "Barcodes Reset Nothing",
      done() {
        return player.b.best.gte(1);
      }
    }
  },
  passiveGeneration() {
    let gain = 0;
    if (hasUpgrade("b", 22)) {
      gain = 1;
    } else if (hasUpgrade("b", 15)) {
      gain = 0.5;
    }
    return gain;
  },
  resetMilestones() {
    return false;
  },
  challenges: {
    rows: 1,
    cols: 1
  },
  upgrades: {
    rows: 2,
    cols: 5,
    11: {
      title: "Be",
      description: "Boost Ability Gain by x2",
      cost: new Decimal(1)
    },
    12: {
      title: "Big",
      description: "Multiply Point Gain based on Barcodes",
      cost: new Decimal(5),
      effect() {
        return player.points
          .add(1)
          .log(10)
          .max(1);
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      }
    },
    13: {
      title: "Body",
      description: "Raise Ability Gain to the Power of 1.2",
      cost: new Decimal(15)
    },
    14: {
      title: "Bond",
      description: "Multiply Barcode Gain based on Abilities",
      cost: new Decimal(50),
      effect() {
        if (hasUpgrade("b", 23))
          return player.a.points
            .add(1)
            .log(10)
            .times(2.5)
            .max(1);
        else
          return player.a.points
            .add(1)
            .log(10)
            .max(1);
      },
      effectDisplay() {
        return format(this.effect()) + "x";
      }
    },
    15: {
      title: "Bend",
      description: "Gain 50% of Barcode Gain Per Second",
      cost: new Decimal(150)
    },
    21: {
      title: "Belt",
      description: "Unlock the first Barcode Buyable",
      cost: new Decimal(500)
    },
    22: {
      title: "Bet",
      description:
        "Remove the Ability to Prestige, but Gain 100% of Barcode Gain per Second",
      cost: new Decimal(2500)
    },
    23: {
      title: "Bad",
      description: "<b>Bond</b> Uses a Better Formula",
      cost: new Decimal(10000)
    },
    24: {
      title: "Baby",
      description: "Unlock a new Ability Buyable",
      cost: new Decimal(25000)
    },
    25: {
      title: "Bake",
      description: "Square Ability Gain",
      cost: new Decimal(100000)
    }
  },
  buyables: {
    rows: 2,
    cols: 2,
    11: {
      title: "<b>Bag</b><br>",
      cost() {
        return new Decimal(9).pow(getBuyableAmount(this.layer, 11)).times(13);
      },
      canAfford() {
        return new Decimal(player.b.points).gte(this.cost());
      },
      unlocked() {
        return hasUpgrade("b", 21);
      },
      display() {
        return `<b>Multiply your Barcode gain\n Cost:</b> ${format(
          this.cost().round()
        )} Barcodes\n <b>Amount:</b> ${getBuyableAmount(
          this.layer,
          11
        )}\n <b>Effect:</b> x${format(this.effect().round())} Barcodes`;
      },
      buy() {
        player.b.points = new Decimal(player.b.points).sub(this.cost());
        setBuyableAmount(
          this.layer,
          11,
          new Decimal(getBuyableAmount(this.layer, 11)).add(1)
        );
      },
      effect() {
        return new Decimal(2).pow(getBuyableAmount(this.layer, 11));
      }
    }
  },
  row: 1, // Row the layer is in on the tree (0 is the first row)
  layerShown() {
    return player.b.unlocked2.gte(1);
  }
});
