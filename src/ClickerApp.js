import { StrictMode } from "react";
import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";

function canAssignHunter(gs) {
  return gs.genpopCounter >= 3 && gs.expertise >= 50;
}

function canAssignFarmer(gs) {
  return gs.genpopCounter >= 5 && gs.foodCounter >= 40;
}

function canAssignPotter(gs) {
  return gs.genpopCounter >= 10 && gs.elderCounter >= 2;
}

function canAssignWeaver(gs) {
  return gs.elderCounter >= 7;
}

function Hunters(props) {
  const gs = props.gameState;
  if (canAssignHunter(gs)) {
    return (
      <p>
        Hunters: {gs.hunterCounter}{" "}
        <button onClick={props.assign}>Assign hunter</button>
      </p>
    );
  } else {
    return <p>Hunters: {gs.hunterCounter}</p>;
  }
}

function Farmers(props) {
  const gs = props.gameState;
  const toggleAutoAdd = props.toggleAutoAdd;
  let assignButton = null;
  let checkmark = null;
  if (canAssignFarmer(gs)) {
    assignButton = <button onClick={props.assign}> assignFarmer</button>;
  }
  if (gs.elderFarmerCounter > 0) {
    checkmark = (
      <input
        type="checkbox"
        checked={gs.audoAddFarmer}
        onClick={toggleAutoAdd}
      />
    );
  }
  return (
    <p>
      Farmers: {gs.farmerCounter} {assignButton} {checkmark}
    </p>
  );
}

function Potters(props) {
  const gs = props.gameState;
  let assignButton = null;

  if (canAssignPotter(gs)) {
    assignButton = <button onClick={props.assign}>Assign potter</button>;
  }
  return (
    <p>
      Potters: {gs.potterCounter} {assignButton}
    </p>
  );
}

function Weavers(props) {
  const gs = props.gameState;
  let button = null;
  if (canAssignWeaver(gs)) {
    button = <button onClick={props.assign}>Assign weaver</button>;
  }
  return (
    <p>
      Weavers: {gs.weaverCounter} {button}
    </p>
  );
}

function Elders(props) {
  if (
    props.gameState.hunterCounter >= 2 &&
    props.gameState.farmerCounter >= 10 &&
    (props.gameState.elderCounter + 1) * 20 < props.gameState.genpopCounter
  ) {
    return (
      <span>
        Elders: {props.gameState.elderCounter}
        <button onClick={props.assign}> Assign elder </button>
      </span>
    );
  } else {
    return <p>Elders: {props.gameState.elderCounter}</p>;
  }
}

function ElderFarmers(props) {
  const gs = props.gameState;
  let counter = null;
  let button = null;
  if (gs.elderFarmerCounter > 0) {
    counter = <span>Elder Farmers: {gs.elderFarmerCounter}</span>;
  }
  if (gs.elderCounter >= 6) {
    button = <button onClick={props.assign}>Assign elder farmer</button>;
  }
  return (
    <p>
      {counter} {button}
    </p>
  );
}

function Fields(props) {
  const gs = props.gameState;
  if (gs.planted > 0) {
    return (
      <p>
        Planted food: {gs.planted} Time to harvest: {gs.time}
      </p>
    );
  } else {
    return <p>-</p>;
  }
}

class ClickerApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: {
        time: 0,

        genpopCounter: 1,
        foodCounter: 55510,
        planted: 0,

        hunterCounter: 0,
        farmerCounter: 0,
        potterCounter: 0,
        weaverCounter: 0,
        elderCounter: 0,
        elderFarmerCounter: 0,

        pottery: 0,
        fabric: 0,
        lumber: 0,

        expertise: 1000,

        autoAddFarmer: false
      }
    };
    // This binding is necessary to make `this` work in the callback
    this.mutate = this.mutate.bind(this);
    this.tick = this.tick.bind(this);
    this.hunt = this.hunt.bind(this);
    this.multiply = this.multiply.bind(this);
    this.trainHunter = this.trainHunter.bind(this);
    this.gainExpertise = this.gainExpertise.bind(this);

    this.assignFarmer = this.assignFarmer.bind(this);
    this.assignElder = this.assignElder.bind(this);
    this.assignElderFarmer = this.assignElderFarmer.bind(this);

    this.assignPotter = this.assignPotter.bind(this);
    this.assignWeaver = this.assignWeaver.bind(this);

    this.cheat = this.cheat.bind(this);

    // checkboxes
    this.toggleAutoAddFarmer = this.toggleAutoAddFarmer.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 2000);
  }

  mutate(mutator) {
    this.setState((state) => {
      var oldGameState = state.gameState;
      mutator(oldGameState);
      return {
        gameState: oldGameState
      };
    });
  }

  tick() {
    /*if (this.state.popCounter < this.state.foodCounter) {
      this.state.popCounter -= this.state.popCounter - this.state.foodCounter;
    }
    this.state.foodCounter -= this.state.popCounter;
    this.render();*/
    this.mutate((gs) => {
      // need to take into account full population
      gs.foodCounter += gs.hunterCounter * 3;

      gs.foodCounter -= gs.genpopCounter;
      gs.foodCounter -= gs.hunterCounter;
      gs.foodCounter -= gs.farmerCounter;
      gs.foodCounter -= gs.potterCounter;
      gs.foodCounter -= gs.weaverCounter;
      gs.foodCounter -= gs.elderCounter * 2;
      gs.foodCounter -= gs.elderFarmerCounter * 3;

      if (gs.foodCounter < 0) {
        gs.foodCounter += gs.elderFarmerCounter * 3;
        gs.elderFarmerCounter = 0;
      }
      if (gs.foodCounter < 0) {
        gs.foodCounter += gs.elderCounter * 2;
        gs.elderCounter = 0;
      }
      if (gs.foodCounter < 0) {
        gs.foodCounter += gs.weaverCounter;
        gs.weaverCounter = 0;
      }
      if (gs.foodCounter < 0) {
        gs.foodCounter += gs.potterCounter;
        gs.potterCounter = 0;
      }
      if (gs.foodCounter < 0) {
        gs.foodCounter += gs.farmerCounter;
        gs.farmerCounter = 0;
      }
      if (gs.foodCounter < 0) {
        gs.foodCounter += gs.hunterCounter;
        gs.hunterCounter = 0;
      }
      if (gs.foodCounter < 0) {
        gs.foodCounter += gs.genpopCounter;
        gs.genpopCounter = 0;
      }

      if (gs.time == 0) {
        gs.foodCounter += gs.planted;
        gs.planted = gs.farmerCounter * 15;
        if (gs.elderFarmerCounter > 0) {
          gs.planted += gs.farmerCounter;
        }
        gs.time = 10;
      } else {
        gs.time -= 1;
      }

      if (gs.time == 1 && gs.autoAddFarmer) {
        this.assignFarmer();
      }

      gs.expertise += gs.elderCounter;
    });
  }

  assignFarmer() {
    this.mutate((gs) => {
      console.log("haha");
      if (!canAssignFarmer(gs)) {
        return;
      }
      gs.foodCounter -= 30;
      gs.genpopCounter -= 1;
      gs.farmerCounter += 1;
      if (gs.planted == 0) {
        gs.planted = 15;
        gs.time = 10;
      }
    });
  }

  assignPotter() {
    this.mutate((gs) => {
      gs.potterCounter += 1;
      gs.genpopCounter -= 1;
    });
  }

  assignWeaver() {
    this.mutate((gs) => {
      gs.weaverCounter += 1;
      gs.genpopCounter -= 1;
    });
  }

  assignHunter() {
    this.mutate((gs) => {
      console.log("toggling");
      gs.autoAddFarmer = !gs.autoAddFarmer;
    });
  }

  toggleAutoAddFarmer() {
    this.mutate((gs) => {
      console.log("toggling");
      gs.autoAddFarmer = !gs.autoAddFarmer;
    });
  }

  assignElder() {
    this.mutate((gs) => {
      gs.genpopCounter -= 1;
      gs.elderCounter += 1;
    });
  }
  assignElderFarmer() {
    this.mutate((gs) => {
      gs.elderCounter -= 1;
      gs.elderFarmerCounter += 1;
    });
  }

  gainExpertise() {
    this.mutate((gs) => {
      gs.expertise += 1;
    });
  }

  hunt() {
    /*this.setState(state => ({
      foodCounter: this.state.foodCounter + 1,
      popCounter: this.state.popCounter
    }));*/
    this.mutate((gs) => {
      gs.foodCounter += 1;
    });
  }

  multiply() {
    this.mutate((gs) => {
      gs.genpopCounter += 1;
    });
  }

  trainHunter() {
    this.mutate((gs) => {
      if (gs.expertise >= 50) {
        gs.genpopCounter -= 1;
        gs.hunterCounter += 1;
        gs.expertise -= 50;
      }
    });
  }

  cheat() {
    this.mutate((gs) => {
      gs.expertise += 100;
      gs.foodCounter += 500;
      gs.elderCounter += 1;
    });
  }

  render() {
    const gameState = this.state.gameState;
    return (
      <div>
        <p>Food: {this.state.gameState.foodCounter}</p>
        <Fields gameState={gameState} />
        <p>-</p>
        <p>Population: {gameState.genpopCounter}</p>
        <Hunters gameState={gameState} assign={this.trainHunter} />
        <Farmers
          gameState={gameState}
          assign={this.assignFarmer}
          toggleAutoAdd={this.toggleAutoAddFarmer}
        />
        <Potters gameState={gameState} assign={this.assignPotter} />
        <Weavers gameState={gameState} assign={this.assignWeaver} />
        <Elders gameState={gameState} assign={this.assignElder} />
        <ElderFarmers gameState={gameState} assign={this.assignElderFarmer} />
        <p>-</p>
        <p>Expertise: {this.state.gameState.expertise}</p>

        <button onClick={this.hunt}>Hunt</button>
        <button onClick={this.multiply}>Multiply</button>
        <button onClick={this.gainExpertise}>Train hunter</button>

        <button onClick={this.cheat}>Cheat</button>
      </div>
    );
  }
}

export { ClickerApp };
