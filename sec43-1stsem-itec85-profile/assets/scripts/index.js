import dateFormat from "../../_snowpack/pkg/dateformat.js";
import "../../third-party/jquery/jquery.min.js";
import "../../third-party/semantic/semantic.min.js";
import Profile from "./profile.js";
const _Page = class {
  static initialize(path) {
    $(() => {
      this.initializeNodes();
      this._initalize(path);
    });
  }
  static initializeNodes() {
    let tab = $(".ui.menu .item");
    tab.tab();
    let progress = $(".ui.progress");
    progress.progress();
  }
  static _initalize(path) {
    let init = (data) => {
      let profile = new Profile(data);
      $("title").text(`Profile | ${profile.fullName}`);
      $("link[rel='icon']").attr("href", profile.image);
      $(".date-year").text(new Date().getFullYear().toString());
      $(`#${_Page.idPrefix}-image`).attr("src", profile.image);
      let container = $(`#${_Page.idPrefix}-labels`);
      container.empty();
      for (let i = 0; i < profile.labels.length; i++) {
        let entry = profile.labels[i];
        let temp = _Page.getTemplate("#_template-profile-label");
        container.append(temp.text(entry));
        if (i < profile.labels.length - 1)
          container.append(_Page.getTemplate("#_template-profile-label-separator"));
      }
      $(`#${_Page.idPrefix}-quote-text`).text(profile.quote.text);
      $(`#${_Page.idPrefix}-quote-author`).text(profile.quote.author);
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
        $(`#${id}`).text(profile[key]);
      }
      $(`.${_Page.idPrefix}-fullname`).text(profile.fullName);
      $(`#${_Page.idPrefix}-birthdate`).text(dateFormat(profile.birthdate, "mmmm d, yyyy"));
      $(`#${_Page.idPrefix}-height`).text(profile.height);
      container = $(`#${_Page.idPrefix}-education`);
      _Page.setContainer(container, "#_template-profile-educationentry", profile.education, (c, t, e) => {
        let from = dateFormat(e.date.from, "mmmm yyyy");
        let to = e.date.to !== null ? dateFormat(e.date.to, "mmmm yyyy") : "Present";
        $(t.children()[0]).text(`${from} - ${to}`);
        $(t.children()[1]).text(e.school);
        $(t.children()[2]).text(e.specialty);
      });
      container = $(`#${_Page.idPrefix}-mastery`);
      _Page.setContainer(container, "#_template-profile-masteryentry", profile.mastery, (c, t, e) => {
        t.find(".label").text(e.label);
        t.attr("data-percent", e.percentage * 100);
        t.find(".bar").css("background-color", e.color);
      });
      _Page.initializeNodes();
      container = $(`#${_Page.idPrefix}-experience`);
      _Page.setContainer(container, "#_template-profile-experienceentry", profile.experience, (c, t, e) => {
        let from = dateFormat(e.date.from, "mmmm yyyy");
        let to = e.date.to !== null ? dateFormat(e.date.to, "mmmm yyyy") : "Present";
        $(t.children()[0]).text(`${from} - ${to}`);
        $(t.children()[1]).text(e.workplace);
        $(t.children()[2]).text(e.position);
      });
      container = $(`#${_Page.idPrefix}-seminar`);
      _Page.setContainer(container, "#_template-profile-seminarentry", profile.seminar, (c, t, e) => {
        $(t.children()[0]).text(dateFormat(e.date, "mmmm dd, yyyy"));
        $(t.children()[1]).text(e.event);
        $(t.children()[2]).text(e.venue);
      });
      container = $(`#${_Page.idPrefix}-recognition`);
      _Page.setContainer(container, "#_template-profile-list-item-subitem", profile.recognition, (c, t, e) => {
        let rt = _Page.getTemplate("#_template-profile-list-item-subitem");
        t.find(".label").text(e.label);
        t.find(".value").text(dateFormat(e.date, "mmmm yyyy"));
        t.find(".root").append(rt);
      });
      container = $(`#${_Page.idPrefix}-presence`);
      _Page.setContainer(container, "#_template-profile-presenceentry", profile.presence, (c, t, e) => {
        t.find(".label").text(e.label);
        t.find(".alias").text(e.alias);
        t.find("a").attr("href", e.address);
        t.find("img").attr("src", e.image);
      });
    };
    $.getJSON(path, init);
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
const ProfilePath = "./assets/documents/profile.json";
Page.initialize(ProfilePath);
