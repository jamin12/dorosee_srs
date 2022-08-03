class ClassArrayManager {
  constructor(mainController, boxController) {
    this.mainController = mainController;
    this.boxController = boxController;
    this.testMode = false;
    this.ClassArray = {
      value1: [
        "BICYCLE",
        "BUS",
        "CAR",
        "ETC",
        "MOTORCYCLE",
        "PEDESTRIAN",
        "TRUCK",
      ],
      value2: [
        "MEDIAN_STRIP",
        "OVERPASS",
        "RAMP_SECT",
        "ROAD_SIGN",
        "SOUND_BARRIER",
        "STREET_TREES",
        "TUNNEL",
      ],
    };
  }

  static init() {
    try {
      this.makeSelectClass();
      let firstValue = Object.keys(this.ClassArray)[0];
      this.makeSelectSubClass(firstValue);
    } catch (e) {
      console.error(e);
    }
  }

  makeSelectClass() {
    try {
      let mid = [];
      for (let i = 0; i < Object.keys(this.ClassArray).length; i++) {
        let value = Object.keys(this.ClassArray)[i];
        let text;
        switch (value) {
          case "value1":
            text = "동적 객체";
            break;
          case "value2":
            text = "주행환경 객체";
            break;
        }
        mid.push(`<option value=${value}>${text}</option>`);
      }

      let returnMessage = `${mid.join("")}`;
      this.testMode == true
        ? console.log("makeSelectClass", returnMessage)
        : "";
      return returnMessage;
    } catch (e) {
      console.error(e);
      return `<option value=error>error</option>`;
    }
  }

  makeSelectSubClass(order) {
    try {
      console.log("order", order);
      let mid = [];
      for (let i = 0; i < this.ClassArray[order].length; i++) {
        let value = this.ClassArray[order][i];
        mid.push(`<option value=${value}>${value}</option>`);
      }
      let returnMessage = `${mid.join("")}`;
      return returnMessage;
      // document.getElementById("select_subclasses").innerHTML = mid.join("");
    } catch (e) {
      console.error(e);
      return `<option value=error>error</option>`;
    }
  }

  makeSelect(order) {
    let mid = [];
    for (let i = 0; i < this.ClassArray[order].length; i++) {
      let value = this.ClassArray[order][i];
      mid.push(`<option value=${value}>${value}</option>`);
    }

    let returnMessage = `<select id= "subclass" class="subclasses">
            ${mid.join("")}
        </select>`;

    console.log("returnMessage", returnMessage);
    return returnMessage;
  }

  makeSelectOption(order) {
    let mid = [];
    for (let i = 0; i < this.ClassArray[order].length; i++) {
      let value = this.ClassArray[order][i];
      mid.push(`<option value=${value}>${value}</option>`);
    }

    let returnMessage = `${mid.join("")}`;

    this.testMode == true ? console.log("returnMessage", returnMessage) : "";
    return returnMessage;
  }
}
