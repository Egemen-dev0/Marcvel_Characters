// WARNING: For GET requests, body is set to null by browsers.

let aPI_Related_things = {
  // self_: this, => incase I need it, not because I made a dumb mistake... xD

  getDatafromAPI: function(callBack) {

var xhr = new XMLHttpRequest();
xhr.withCredentials = false;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    callBack(this.responseText);
  }
});

xhr.open("GET", "http://gateway.marvel.com/v1/public/characters?ts=1&hash=0966c6c5647153700fc5aa2cfe1b5aba&apikey=a2d55ff212f0cfcf3ef24b3882e1093e");

xhr.send();
}, 
// Look at BELOW==>
// dataFormatter: function(){
// let formatted = this.getDatafromAPI(function(textToBeFormatted){
// JSON.parse(textToBeFormatted);
// })
// return formatted
// },
 }





document.addEventListener("DOMContentLoaded", function(){
aPI_Related_things.getDatafromAPI(function(acquiredApi){
console.log(JSON.parse(acquiredApi))
})



})
