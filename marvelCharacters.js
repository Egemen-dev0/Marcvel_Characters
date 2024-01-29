// WARNING: For GET requests, body is set to null by browsers.

let paraPesinDatasıCachein = {
  cached: {},
  // Note that offset starts at 0 and ascends/decends by 20 with each next/prev button is clicked.
  addtoCached: function (offsetNbr, dataToBeSaved) {
    paraPesinDatasıCachein.cached[offsetNbr + ""] = [...dataToBeSaved];
  },

  removefromCached: function (offsetNbr) {
    delete paraPesinDatasıCachein.cached(offsetNbr);
    return !paraPesinDatasıCachein.checkListDatainCached(offsetNbr);
  },

  getListDatafromCached: function (offsetNbr) {
    let cachedListData = paraPesinDatasıCachein.cached[offsetNbr + ""];
    return cachedListData
  },

  checkListDatainCached: function (offsetNbr) {
    return paraPesinDatasıCachein.cached.hasOwnProperty(offsetNbr)
  },

  turnCachedintoSingleArray: function () {
    let iteratedPagesCachedData = Object.values(paraPesinDatasıCachein.cached)
    let singledDownArray = iteratedPagesCachedData.flatMap(arr => arr)
    let setSingleArray = new Set(singledDownArray);
    return Array.from(setSingleArray)
  },

}


let persistentDataLayer = {

  checeker: function (offsetNbr, getDataCb) {
    if (paraPesinDatasıCachein.checkListDatainCached(offsetNbr)) {
      getDataCb(paraPesinDatasıCachein.getListDatafromCached(offsetNbr));
      return;
    }
  },
}



let aPI_Related_things = {

  getDatafromAPI: function (callBack) {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let deneme = JSON.parse(this.responseText);
        paraPesinDatasıCachein.addtoCached(layOut_Related_things.offset, deneme.data.results)
        callBack(this.responseText);
      }
    });

    xhr.open("GET", `http://gateway.marvel.com/v1/public/characters?ts=1&hash=0966c6c5647153700fc5aa2cfe1b5aba&apikey=a2d55ff212f0cfcf3ef24b3882e1093e&offset=${layOut_Related_things.offset}&limit=20`);

    // If you want to add more characters try adding this at the of the request URL: &offset=100&limit=50 **Chage the Nbrs as you wish but limit can be 100 max!

    xhr.send();
  },
  getDataAsync: function () {
    return new Promise((resolve, reject) => {
      try {
        aPI_Related_things.getDatafromAPI(function (acquiredApi) {
          resolve(acquiredApi)
        });
      } catch (error) {
        alert("Olmadı Başkan here is why:", error);
        reject(error);
      }


    });
  },
  // Look at BELOW==>
  dataFormatter: function (acquiredApi) {
    return JSON.parse(acquiredApi).data.results // =>Bunu direkt buraya eklesem 
  },
}

let layOut_Related_things = {
  page: 1,

  divCreator: function (chracterDetails) {
    let list_Item_structure = `<div>
<img src="${chracterDetails.thumbnail.path}/portrait_uncanny.${chracterDetails.thumbnail.extension}" alt="temp">
 <h2>${chracterDetails.name}</h2>
    <p>${chracterDetails.description}</p>
</div>`

    return list_Item_structure
  },
  offset: 0,

  cachedFilter: function(searchText){
let turnedArr = paraPesinDatasıCachein.turnCachedintoSingleArray();
let filteredArr = turnedArr.filter((x) => x.name.toLowerCase().includes(searchText.toLowerCase()));
return filteredArr
  },

}

let theImplementor = {
  // BUTTONS DISSAPPEAR AFTER - FIX BELOW!
  listMaker: function (arrtoBecomeList) {
    let divCatcher = document.getElementsByTagName("div")[0];
    let generatedListItemReceiver = "";
    for (let i = 0; i < arrtoBecomeList.length; i++) {
      generatedListItemReceiver += layOut_Related_things.divCreator(arrtoBecomeList[i]);
    }
    divCatcher.innerHTML = "";
    divCatcher.innerHTML = generatedListItemReceiver;
  },

  listGenerator: async function () {
    let offsetNbr = layOut_Related_things.offset;
    persistentDataLayer.checeker(offsetNbr, function (cachedDataObj) {
      theImplementor.listMaker(cachedDataObj);

    });
    let acquiredApi = await aPI_Related_things.getDataAsync();
    let formattedData = aPI_Related_things.dataFormatter(acquiredApi);
    theImplementor.listMaker(formattedData);
    // aPI_Related_things.getDatafromAPI(function(arrayListToBeShownonPage){
    //   let formattedData = aPI_Related_things.dataFormatter(arrayListToBeShownonPage);
    //   console.log(formattedData)
    //   theImplementor.listMaker(formattedData)
    //
    // })

  },

  searchResultFromCachedList: function(){
let searchBoxCatcher = document.getElementById("searchbox");
let searchText = searchBoxCatcher.value;
let searchedValue = layOut_Related_things.cachedFilter(searchText);
this.listMaker(searchedValue);


  },

  nexButtonClicked: async function () {
    layOut_Related_things.offset += 20;
    await this.listGenerator()
  },

  prevButtonClicked: async function () {
    if (layOut_Related_things.offset >= 20) {
      layOut_Related_things.offset -= 20;
    }
    await this.listGenerator()
  },

}

document.addEventListener("DOMContentLoaded", async function () {
  await theImplementor.listGenerator();
})
