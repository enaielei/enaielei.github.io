import dateFormat from "../../_snowpack/pkg/dateformat.js";
import "../third-party/jquery/jquery.min.js";
import "../third-party/semantic/semantic.min.js";
import Profile from "./profile.js";
const _Page = class {
  static initialize(data) {
    $(() => {
      this.initializeNodes();
      this.setEntries(data);
      this.profiles = data;
    });
  }
  static initializeNodes() {
    let tab = $(".ui.menu .item");
    tab.tab();
    let progress = $(".ui.progress");
    progress.progress();
    let acc = $(".ui.accordion");
    acc.accordion({
      selector: {
        trigger: ".title .icon-label"
      }
    });
    $(".ui.dropdown").dropdown();
    $(".ui.calendar").calendar({
      type: "date"
    });
    let modal = $(`#${this.idPrefix}-add-entry-modal`);
    modal.modal({
      blurring: true,
      onApprove: (e) => {
      }
    });
    let form = $(`#${this.idPrefix}-add-entry-modal .form`);
    form.form({
      fields: {
        "given-name": "empty",
        "family-name": "empty",
        sex: "empty",
        birthdate: "empty",
        height: "empty",
        "civil-status": "empty",
        religion: "empty"
      }
    });
    let formSubmitBtn = form.find(".submit");
    formSubmitBtn.on("click", () => {
      if (form.form("is valid")) {
        let data = {
          givenName: form.form("get value", "given-name"),
          middleName: form.form("get value", "middle-name") ?? " ",
          familyName: form.form("get value", "family-name"),
          sex: form.form("get value", "sex"),
          birthdate: form.form("get value", "birthdate"),
          height: form.form("get value", "height").toString() + " cm",
          civilStatus: form.form("get value", "civil-status"),
          religion: form.form("get value", "religion")
        };
        this.profiles.push(new Profile(data));
        let li = this.profiles.length - 1;
        this.profiles[li].entryClass = `entry-${li}`;
        modal.modal("hide");
        form.form("clear");
        _Page.setEntries(this.profiles);
        _Page.validateButtons();
      }
    });
    let toggleBtns = $(`.${this.idPrefix}-toggle-check-btn`);
    for (let btn of toggleBtns) {
      $(btn).on("click", () => {
        $(`#main-container .checkbox`).checkbox("toggle");
      });
    }
    let removeBtns = $(`.${this.idPrefix}-remove-entry-btn`);
    for (let btn of removeBtns) {
      $(btn).on("click", () => {
        let ecs = this.entriesChecked.values();
        for (let ec of ecs) {
          $(`.${ec}`).remove();
          this.entriesChecked = this.entriesChecked.filter((e) => e !== ec);
          this.profiles = this.profiles.filter((p, i) => {
            return ec !== p.entryClass;
          });
          _Page.validateButtons();
        }
      });
    }
    let addBtns = $(`.${this.idPrefix}-add-entry-btn`);
    for (let btn of addBtns) {
      $(btn).on("click", () => {
        modal.modal("show");
      });
    }
    _Page.validateButtons();
  }
  static setEntries(data) {
    $(".date-year").text(new Date().getFullYear());
    let container = $(`#${this.idPrefix}-entries`);
    _Page.setContainer(container, "#_template-profile-entry-label", data, (c, t, e) => {
      let entryClass = `entry-${data.indexOf(e)}`;
      t.addClass(entryClass);
      let checkbox = t.find(".checkbox");
      checkbox.checkbox({
        onChange: () => {
          let checked = checkbox.checkbox("is checked");
          let added = _Page.entriesChecked.includes(entryClass);
          if (checked) {
            if (!added)
              _Page.entriesChecked.push(entryClass);
          } else if (added)
            _Page.entriesChecked = _Page.entriesChecked.filter((e2) => e2 !== entryClass);
          _Page.validateButtons();
        }
      });
      t.find(".text").text(e.fullName);
      let content = _Page.getTemplate("#_template-profile-entry-content");
      content.addClass(entryClass);
      _Page.setEntry(content, e);
      c.append(content);
    });
  }
  static validateButtons() {
    let btns = $(`.${this.idPrefix}-remove-entry-btn`);
    let disabled = this.entriesChecked.length === 0;
    for (let btn of btns) {
      if (disabled)
        $(btn).addClass("disabled");
      else
        $(btn).removeClass("disabled");
    }
    btns = $(`.${this.idPrefix}-toggle-check-btn`);
    disabled = this.profiles.length === 0;
    for (let btn of btns) {
      if (disabled)
        $(btn).addClass("disabled");
      else
        $(btn).removeClass("disabled");
    }
  }
  static setEntry(entry, profile) {
    for (let key of [
      "givenName",
      "middleName",
      "familyName",
      "gender",
      "sex",
      "civilStatus",
      "religion"
    ]) {
      let id = [this.idPrefix, key].join("-").toLowerCase();
      entry.find(`.${id}`).text(profile[key]);
    }
    entry.find(`.${_Page.idPrefix}-birthdate`).text(dateFormat(profile.birthdate, "mmmm d, yyyy"));
    entry.find(`.${_Page.idPrefix}-height`).text(profile.height);
  }
  static getTemplate(id) {
    return $(`#_template ${id}`).clone().removeAttr("id");
  }
  static setContainer(container, entryTemplateId, entries, callback) {
    container.empty();
    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];
      let temp = _Page.getTemplate(entryTemplateId);
      container.append(temp);
      if (callback)
        callback(container, temp, entry);
    }
  }
};
let Page = _Page;
Page.idPrefix = "profile";
Page.profiles = [];
Page.entriesChecked = [];
Page.initialize(Page.profiles);
