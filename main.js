let expenses_limit_month = 3122.95
let balance = 3122.95
let expenses_limit_week = expenses_limit_month/4;
let movements = [];
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
          position: "center",
          title: "Enviando información",
          showConfirmButton: false,
          confirmButtonColor: "#3085d6",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        sendData(data)
        elements[0].value=""
        elements[1].value=""
        elements[2].value=""
        break
      }
    }
  }
}
function sendData(array) {
  console.log(array)
  var data = JSON.stringify({
    monto: `${array[0]}`,
    concepto: `${array[1]}`,
    fecha: `${array[2]}`,
  });
  console.log(data)
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
      setBalance(res.data[0])
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Información enviada",
        showConfirmButton: false,
        confirmButtonColor: "#3085d6",
      });
    })
    .catch(async (err) => {
      console.log(err)
    });
}
function setExpensesMonth(){
  if(movements.length == 0){
    document.getElementById("card-body").innerHTML += `<p class="card-text text-center">$${balance}</p>`
  }
  else{
    setBalance()
  }
}
function setBalance(data){
  movements.push(data)
  for (let k = 0; k< movements.length; k++){
    balance = balance - movements[k].monto
  }
  console.log(balance)
}
// 120.72, Pizza, mayo 1
// 1317, Regalo mamá, mayo 1