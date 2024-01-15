import "https://moviekatalog.com/jsorrery-public.js?t=5";

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
loadCSS("https://mgvez.github.io/jsorrery/jsorrery.css");

const CARD_CSS = `
  ha-card.jsorrery {
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;

    justify-content: center;
    align-items: center;
    line-height: normal;
    width: 100%;
    height: 100%;
  }

  .jsorrery-container {
    width: 100%;
    height: 100%;
    text-align: center;
    align-items: center;
    background-color: black;
  }
  .universe-wrapper {
    max-width: 100%;
    height: 100%;
    place-self: center;
  }

  .universe-container {
    display: flex;
    grid-area: i;
    height: 100%;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    align-self: center;
    justify-self: center;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 300px;
  }
  button.play-pause {
    position: absolute;
    left: 10px;
    top: 10px;
  }
`;

class JSOrreryCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {

    // Initialize the content if it's not there yet.
    if (!this.content) {
      console.log('content div', window.JSORRERY);
      this.innerHTML = `
        <style>${CARD_CSS}</style>
        <div id="aspect-ratio" style="display:inline;">
          <ha-card class="jsorrery" header="${this.config.title || ''}">
            <div class="jsorrery-container" >
              <div class="universe-wrapper" >
                <div class="universe-container" >
                </div>
              </div>
            </div>
          </ha-card>
        </div>
      `;
      this.content = this.querySelector("div.universe-container");

    } else if ( this.content.offsetWidth && this.content.offsetHeight && !this.JSOrrery ) {

      const {
        JSOrrery,
        Scenarios,
        DefaultScenarios
      } = window.JSORRERY;
      this.JSOrrery = new JSOrrery(this.content);
      const scene = JSOrrery.Scenarios.getList().find(e => e.name == this.config.scenario ) || JSOrrery.Scenarios.getList()[0];
      this.JSOrrery.loadScenario( scene );

      if ( String(this.config.autoplay) == 'true' ) {
        this.JSOrrery.activeScenario.scene.universe.playing = true
      }
    }

  //   const scenario = this.config.scenario || 'InnerSolarSystem';

  // //   const entityId = this.config.entity;
  // //   const state = hass.states[entityId];
  // //   const stateStr = state ? state.state : "unavailable";

  // //   this.content.innerHTML = `
  // //     The state of ${entityId} is ${stateStr}!
  // //     <br><br>
  // //     <img src="http://via.placeholder.com/350x100">
  // //   `;
  //     this.JSOrrery.loadScenario( this.JSOrrery.Scenario.get(scenario), {} );
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("jsorrery-card", JSOrreryCard);
