let today = new Date;
let previousDay = new Date(today)
previousDay.setDate(today.getDate()-1)
let nextDay = new Date(today)
nextDay.setDate(today.getDate()+1)
let lastDayOfMonth = new Date(today.getFullYear(),today.getMonth()+1,0);

function setHTMLElements(action){
  console.log(action)
  if(action == "clean"){
    document.getElementById("actualDate").innerHTML = ``;
    document.getElementById("endDate").innerHTML = ``;
    document.getElementById("register-expense").innerHTML = ``;
    document.getElementById("balanceDiv").innerHTML = ``;
    document.getElementById("expensesDiv").innerHTML = ``;
    document.getElementById("historialDiv").innerHTML = ``;
    setHTMLElements()
  }
  else{
    document.getElementById("actualDate").innerHTML += `
    <p class="text-center text-white m-0">Hoy es: ${today.toDateString().slice(4,15)}</p>
    `
    document.getElementById("endDate").innerHTML += `
    <p class="text-center text-white m-0">Fecha de corte: ${lastDayOfMonth.toDateString().slice(4,15)}</p>
    `
    document.getElementById("register-expense").innerHTML += `
    <div class="input-group" style="padding-bottom: 10px">
      <span class="input-group-text" id="basic-addon1">Monto</span>
      <input type="number" class="form-control" placeholder="Ejemplo: 70" aria-label="Monto" aria-describedby="basic-addon1">
    </div>
    <div class="input-group" style="padding-bottom: 10px">
      <span class="input-group-text" id="basic-addon1">Concepto</span>
      <input type="text" class="form-control" placeholder="Ejemplo: Entrada cine" aria-label="Monto" aria-describedby="basic-addon1">
    </div>
    
    <div class="d-grid gap-2">
      <button class="btn btn-success bg-gradient" type="button" onclick="getValues()" style="height: 41px;">Registrar</button>
    </div>
    `
    document.getElementById("balanceDiv").innerHTML += `
    <div class="card" style="width: -webkit-fill-available;" id="insertBalance">
        <div class="card-header bg-success bg-gradient text-white text-center">
          Gasto disponible
        </div>
        <div class="card-body" id="card-body">
        </div>
    </div>
    `
    document.getElementById("expensesDiv").innerHTML += `
    <div class="card" style="width: -webkit-fill-available;" id="insertBalance">
        <div class="card-header bg-success bg-gradient text-white text-center">
          Gasto hecho
        </div>
        <div class="card-body" id="card-body-expenses">
        </div>
    </div>
    `
    document.getElementById("historialDiv").innerHTML += `
    <div class="card-header bg-success bg-gradient text-white text-center">
        Historial del mes actual
    </div>
    `
  }
}
function getValues() {
  var data = [];
  var elements = document.getElementsByTagName("input");
  for (i = 0; i < elements.length; i++) {
    if ((elements[i].type == "number" || "text" || "date")) {
      if (elements[0].value === ""){
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Falta agregar el monto",
          showConfirmButton: true,
          confirmButtonColor: "#3085d6",
        });
      }
      else if(elements[1].value === ""){
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Falta agregar el concepto",
          showConfirmButton: true,
          confirmButtonColor: "#3085d6",
        });
      }
      // else if(elements[2].value === ""){
      //   Swal.fire({
      //     position: "center",
      //     icon: "info",
      //     title: "Falta agregar la fecha",
      //     showConfirmButton: true,
      //     confirmButtonColor: "#3085d6",
      //   });
      // }
      else {
        data.push(elements[0].value);
        data.push(elements[1].value);
        // data.push(elements[2].value);
        Swal.fire({
          icon: 'info',
          title: 'Datos a enviar',
          showDenyButton: true,
          confirmButtonText: 'Ok',
          denyButtonText: `Revisar`,
          html:`
            <p>Monto: ${elements[0].value}</p>
            <p>Concepto: ${elements[1].value}</p>
            
          `,
          confirmButtonColor: "#3085d6",
          focusConfirm: true,
          confirmButtonText: 'Ok',
        })
        .then((result) => {
          if(result.isConfirmed){
            this.sendData(data)
            elements[0].value = ""
            elements[1].value = ""
            // elements[2].value = ""
          }
        })
        break
      }
    }
  }
}
function sendData(array) {
  var data = JSON.stringify({
    monto: `${array[0]}`,
    concepto: `${array[1]}`,
    fecha: today,
    // fecha: `${array[2]}`,
  });
  var config = {
    method: "post",
    url: "https://sheet.best/api/sheets/642164ff-8ec0-4d09-ac10-9083c2f47ea9/tabs/registro",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  Swal.fire({
    didOpen: () => {
      Swal.showLoading() 
    }
  })
  axios(config)
    .then((res) => {
      setHTMLElements("clean")
      getMovements();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Información enviada",
        showConfirmButton: true,
        confirmButtonColor: "#3085d6",
      });
    })
    .catch(async (err) => {
      console.log(err)
    });
}
function getMovements(){
  var config = {
    method: "get",
    url: "https://sheet.best/api/sheets/642164ff-8ec0-4d09-ac10-9083c2f47ea9/tabs/registro",
    mode: "cors",
    headers: {
      "Content-type": "application/json"
    }
  }
  axios(config)
  .then((res) => {
    filterMovements(res.data)
  })
  .catch(async(err) => {
    console.log(err)
  })
}
function filterMovements(array){
  let month = 0;
  let filteredData = []
  for (let i = 0; i<array.length; i++){
    if(array[i].fecha.slice(5,7).includes("01")){
      month = 1
    }
    if(array[i].fecha.slice(5,7).includes("02")){
      month = 2
    }
    if(array[i].fecha.slice(5,7).includes("03")){
      month = 3
    }
    if(array[i].fecha.slice(5,7).includes("04")){
      month = 4
    }
    if(array[i].fecha.slice(5,7).includes("05")){
      month = 5
    }
    if(array[i].fecha.slice(5,7).includes("06")){
      month = 6
    }
    if(array[i].fecha.slice(5,7).includes("07")){
      month = 7
    }
    if(array[i].fecha.slice(5,7).includes("08")){
      month = 8
    }
    if(array[i].fecha.slice(5,7).includes("09")){
      month = 9
    }
    if(array[i].fecha.slice(5,7).includes("10")){
      month = 10
    }
    if(array[i].fecha.slice(5,7).includes("11")){
      month = 11
    }
    if(array[i].fecha.slice(5,7).includes("12")){
      month = 12
    }
    if(month === today.getMonth()+1
    ){
      filteredData.push(array[i])
    }
  }
  setBalanceAndMovements(filteredData)
}
let hoy = 1
let manana = 31
function setBalanceAndMovements(array){
  console.log(array.length)
  if( today.getDate() < previousDay.getDate() || array.length == 0 ){
    console.log("entra aquí por array.length = 0")
    let balance = 3122.95;
    document.getElementById("card-body").innerHTML += `
    <p class="card-text text-center">$${balance}</p>
    `
    document.getElementById("card-body-expenses").innerHTML += `
    <p class="card-text text-center">$${0}</p>
    `
    document.getElementById("sectionToDisplay").style.display = "block"
    document.getElementById("sectionToHide").style.display = "none"
  }
  else if(array.length > 0){
    let insertMovements = document.getElementById("insertMovements")
    let movements = ``;
    let balance = 3122.95;
    let actualExpenses = 0;
    for (let i = array.length-1; i>=0; i--){
      actualExpenses = actualExpenses + parseFloat(array[i].monto)
      movements += `
      <li class="list-group-item">El ${array[i].fecha.slice(8,10)} gastaste $${array[i].monto} en ${array[i].concepto}</li>
      `
    }
    balance = parseFloat(balance - actualExpenses).toFixed(2);
    document.getElementById("card-body").innerHTML += `
    <p class="card-text text-center">$${balance}</p>
    `
    document.getElementById("card-body-expenses").innerHTML += `
    <p class="card-text text-center">$${actualExpenses}</p>
    `
    insertMovements.innerHTML = movements;
    document.getElementById("sectionToDisplay").style.display = "block"
    document.getElementById("sectionToHide").style.display = "none"
  }
}
// console.log("ayer: ",previousDay)
// console.log("hoy: ",today)
// console.log("mañana: ",nextDay)
