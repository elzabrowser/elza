const remote = window.require('electron').remote;
const app = remote.app;
const fs = window.require("fs");
var path = app.getPath('documents') + '/Expert-Evidence'
export default function () {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}