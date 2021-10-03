import Qty from "../../_snowpack/pkg/js-quantities.js";
export default class Profile {
  get fullName() {
    let fn = `${this.givenName} ${this.middleName} ${this.familyName}`;
    return fn.replace("  ", " ");
  }
  constructor(data) {
    Profile._normalizeData(data);
    this.image = data.image;
    this.religion = data.religion;
    this.civilStatus = data.civilStatus;
    this.height = data.height;
    this.familyName = data.familyName;
    this.givenName = data.givenName;
    this.middleName = data.middleName;
    this.birthdate = data.birthdate;
    this.sex = data.sex;
    this.labels = data.labels;
    this.quote = data.quote;
    this.education = data.education;
    this.mastery = data.mastery;
    this.recognition = data.recognition;
    this.presence = data.presence;
    this.seminar = data.seminar;
    this.experience = data.experience;
  }
  static _normalizeData(data) {
    data.birthdate = new Date(data.birthdate);
    data.height = new Qty(data.height);
    let entries = data.education.concat(data.experience);
    for (let entry of entries) {
      entry.date.from = new Date(entry.date.from);
      if (entry.date.to !== null)
        entry.date.to = new Date(entry.date.to);
    }
    data.middleName ??= "";
  }
}
