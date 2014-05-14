
window.addEventListener("ast-request", function(event) {
  // Message from page script
  //console.log('emitting parse-to-ast-request towards main script with:', event.detail);
  // Send to main, privileged script:
  self.port.emit("parse-to-ast", event.detail);
}, false);


self.port.on("ast-given", function(obj) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent("ast-parsed", true, true, JSON.stringify(obj));
  document.documentElement.dispatchEvent(event);
  //console.log("CS got an ast object see here: ", JSON.stringify(obj));
});



/*

 document.documentElement.addEventListener("ast-parsed", function(event) {
 window.alert(JSON.stringify(event.detail))
 }, false);



 function sendMessage() {
 var event = document.createEvent('CustomEvent');
 event.initCustomEvent("ast-request", true, true, "a=0");
 document.documentElement.dispatchEvent(event);
 }


 */