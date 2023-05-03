let today = new Date;
let lastDayOfMonth = new Date(today.getFullYear(),today.getMonth()+1,0);
function setHTMLElements(action){
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
    <div class="input-group" style="padding-bottom: 10px">
      <span class="input-group-text" id="basic-addon1">Fecha</span>
      <input type="text" class="form-control" placeholder="Ejemplo: mayo 1" aria-label="Monto" aria-describedby="basic-addon1">
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
        Historial
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
      else if(elements[2].value === ""){
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Falta agregar la fecha",
          showConfirmButton: true,
          confirmButtonColor: "#3085d6",
        });
      }
      else {
        data.push(elements[0].value);
        data.push(elements[1].value);
        data.push(elements[2].value);
        Swal.fire({
          icon: 'info',
          title: 'Datos a enviar',
          showDenyButton: true,
          confirmButtonText: 'Ok',
          denyButtonText: `Revisar`,
          html:`
            <p>Monto: ${elements[0].value}</p>
            <p>Concepto: ${elements[1].value}</p>
            <p>Fecha: ${elements[2].value}</p>
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
            elements[2].value = ""
          }
        })
        // Swal.fire({
        //   position: "center",
        //   title: "Enviando información",
        //   showConfirmButton: false,
        //   confirmButtonColor: "#3085d6",
        //   didOpen: () => {
        //     Swal.showLoading();
        //   },
        // });
        // sendData(data)
        // elements[0].value=""
        // elements[1].value=""
        // elements[2].value=""
        break
      }
    }
  }
}
function sendData(array) {
  var data = JSON.stringify({
    monto: `${array[0]}`,
    concepto: `${array[1]}`,
    fecha: `${array[2]}`,
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
    setBalanceAndMovements(res.data)
  })
  .catch(async(err) => {
    console.log(err)
  })
}
function setBalanceAndMovements(array){
  if(array.length == 0){
    let balance = 3122.95;
    document.getElementById("card-body").innerHTML += `
    <p class="card-text text-center">$${balance}</p>
    `
    document.getElementById("card-body-expenses").innerHTML += `
    <p class="card-text text-center">$${0}</p>
    `
  }
  else if(array.length > 0){
    let insertMovements = document.getElementById("insertMovements")
    let movements = ``;
    let balance = 3122.95;
    let actualExpenses = 0;
    for (let i = 0; i<array.length; i++){
      actualExpenses = actualExpenses + parseFloat(array[i].monto)
      movements += `
      <li class="list-group-item">$${array[i].monto} en ${array[i].concepto}</li>
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
  }
}
