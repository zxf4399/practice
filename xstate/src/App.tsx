import { createMachine, interpret } from "xstate";

const triggerMachine = createMachine(
  {
    id: "trigger",
    initial: "inactive",
    states: {
      inactive: {
        on: {
          TRIGGER: {
            target: "active",
            // transition actions
            actions: ["activate", "sendTelemetry"],
          },
        },
      },
      active: {
        // entry actions
        entry: ["notifyActive", "sendTelemetry"],
        // exit actions
        exit: ["notifyInactive", "sendTelemetry"],
        on: {
          STOP: { target: "inactive" },
          CLOSE: { target: "close" },
        },
      },
      close: {
        type: "final",
      },
    },
  },
  {
    actions: {
      // action implementations
      activate: (context, event) => {
        console.log("activating...");
      },
      notifyActive: (context, event) => {
        console.log("active!");
      },
      notifyInactive: (context, event) => {
        console.log("inactive!");
      },
      sendTelemetry: (context, event) => {
        console.log("time:", Date.now());
      },
    },
  }
);

const triggerService = interpret(triggerMachine).onTransition((state) =>
  console.log(state.history?.value, state.value)
);

triggerService.start();

triggerService.send("TRIGGER");

// active node doesn't listen to TRIGGER event
// the reuslt of onTransition console is active active
triggerService.send("TRIGGER");

triggerService.send("CLOSE");

function App() {
  return null;
}

export default App;
