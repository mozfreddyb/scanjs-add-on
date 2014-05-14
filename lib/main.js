var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

// Parser API:
const {Cu} = require("chrome");
var Reflect = Cu.import("resource://gre/modules/reflect.jsm");
Reflect.init();


pageMod.PageMod({
  include: data.url("scanjs/client/index.html"),
  contentScriptFile: data.url("contentScript.js"),
  onAttach: function(worker) {
    worker.port.on("parse-to-ast", function(obj) {
      var source = obj.source;
      var filename = obj.filename;
      try {
        var ast = Reflect.parse(source);
        //console.log("ast is "+ JSON.stringify(ast));
        worker.port.emit("ast-given", {'filename': filename, 'ast': ast, 'source': source});
        console.log("Parsed syntax for "+ filename);
      } catch(e) {
        console.log("Parse Error "+e);
        console.log("object keys for parse rror: " + Object.keys(e))
        worker.port.emit('ast-given', {
            type: 'error',
            name: e.name,
            pos: e.pos,
            loc: { column: e.loc.column, line: e.loc.line },
            message: e.message,
            filename: filename
          });
      }
    });
  }
});


var button = buttons.ActionButton({
  id: "scanjs-button",
  label: "Run ScanJS",
  icon: {
    // this is from the data directory
    "16": "./icon/scanjs_16.png",
    "32": "./icon/scanjs_32.png",
    "64": "./icon/scanjs_64.png",
    "128": "./icon/scanjs_128.png",
    "256": "./icon/scanjs_256.png"
  },
  onClick: function openScanJSinTab(state) {
    var maintab = tabs.open(data.url("scanjs/client/index.html"));
  }
});


