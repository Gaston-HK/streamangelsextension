// Extension Version
const Version = "0.3.1 [ALPHA]";

// Tiempo de inicio para medir el rendimiento
const startTime = performance.now();

// Configuración de recarga automática y fecha actual
const autoreload = parseInt(localStorage.getItem("autoreload") || 0);
const currentDate = new Date();

// Valor de un minuto y URL de fondo
const mValue = parseFloat(localStorage.getItem("mValue") || 0.004);
const urlBg = localStorage.getItem("urlBg") || "";
const WithdrawalVal = parseFloat(localStorage.getItem("WithdrawalVal") || 80.0);

// Elemento de referencia donde se insertará la extensión
const divReference = document.getElementById("alimetro");

// Creación del elemento de la extensión
const extensionElement = document.createElement("div");
extensionElement.id = "HKExtension";
extensionElement.innerHTML = getFormattedDiv();
extensionElement.classList.add("row", "mt-4", "p-3", "box-4");

// Configuración de fondo si está disponible
if (urlBg != "") {
  extensionElement.style.background = `url('${urlBg}') no-repeat center`;
  extensionElement.style.backgroundSize = "cover";
}

// Insertar la extensión en el documento
divReference.parentNode.insertBefore(extensionElement, divReference.nextSibling);

// Creación del elemento de configuración de la extensión
const newSettings = document.createElement("div");
newSettings.id = "HKSettings";
newSettings.innerHTML = get_formateset();
newSettings.classList.add("row", "mt-4", "p-3", "box-4");

// Insertar la configuración en el documento, después de la extensión
extensionElement.parentNode.insertBefore(newSettings, extensionElement.nextSibling);

var minutesAdded = 0;

function getFormattedDiv() {
    // Obtener la fecha actual en formato de cadena de texto
    const lastupdate = currentDate.toString();
  
    // Obtener el saldo almacenado, el valor mensual y calcular el total
    const balance = parseFloat(getSavedValue());
    const toAdd = parseFloat(getMonthlyValue());
    const total = (balance + toAdd).toFixed(2);
  
    // Formatear la fecha de la última actualización
    const formattedDate = formatdate(lastupdate);
  
    // Obtener la validez de la última actualización desde el almacenamiento local
    const lastupdatevalid = localStorage.getItem("datevalid") || "0";
    const lastminutevalid = parseInt(localStorage.getItem("lastminutevalid")) || 0;
  
    // Formatear la fecha de la última actualización válida
    const formattedDateValid = formatdate(lastupdatevalid);
  
    // Obtener el total de minutos del día y actualizarlo
    const totalDay = get_total_day() + minutesAdded;
    save_total_day(totalDay);

    // Tiempo visto
    const minutes = getMinutesDay();
    const balanceHours = Math.floor(minutes / 60); // Obtener las horas completas
    const remainingMinutes = minutes % 60; // Obtener los minutos restantes
        
    // Crear el texto para mostrar la última información válida si existe
    const textlast = `<hr>
      <h6 class="text-decoration-underline text-center">LAST GEM COLLECTED</h6>
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Last Minutes (valid): ${lastminutevalid}
      </li> 
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Last update (valid): ${formattedDateValid}
      </li>`;
  
    // Construir y devolver la estructura HTML con comentarios
    return `
      <div class="col-lg-12">
        <!-- Información del encabezado -->
        <div class="col-12">
          <span class="element-4 text-center"><i class="fa fa-info-circle" aria-hidden="true"></i>
           HK Extension</span>
          <span class="elementor-3"></span>
        </div>
  
        <!-- Lista de datos -->
        <ul class="list-unstyled">
          <!-- Balance del día -->
          <h6 class="text-decoration-underline text-center">TOTAL MONEY FOR THE DAY</h6>
          <li class="mb-2">
            <i class="fa fa-arrow-right" aria-hidden="true"></i> Day Balance: ${toAdd.toFixed(2)} <i class="fa fa-eur" aria-hidden="true"></i> | (<span class="text-success">+${minutes < 0 ? '0.0%' : (((minutes * mValue) * 100) / WithdrawalVal).toFixed(2)}%</span>)
          </li>
          <hr>
  
          <!-- Balance total -->
          <h6 class="text-decoration-underline text-center">TOTAL MONEY</h6>
          <li class="mb-2">
            <i class="fa fa-arrow-right" aria-hidden="true"></i> Total Balance: ${total} <i class="fa fa-eur" aria-hidden="true"></i> | (${((total * 100) / WithdrawalVal).toFixed(2)}%)
          </li>
          <div style="width: 100%; display: block; max-width: 100%; height: 32px; background-color: #FFE500;" class="p-0 mt-3 rounded">
          <div id='progressbar' class="progress p-0 rounded" style="width: ${Math.min(Math.max(0, (total * 100) / WithdrawalVal), 100)}%; height: 32px; background-color: #7D2EC5;">
          </div>
          </div>
          <hr class="mt-3">
  
          <!-- Información de recarga -->
          <h6 class="text-decoration-underline text-center">RELOAD INFORMATION</h6>
          <li class="mb-2">
            <i class="fa fa-arrow-right" aria-hidden="true"></i> Added minutes: ${minutesAdded}
          </li>
          <li class="mb-2">
            <i class="fa fa-arrow-right" aria-hidden="true"></i> Last Refresh: ${formattedDate}
          </li>
          ${lastminutevalid > 0 ? textlast : ""}
          <hr>
  
          <!-- Minutos del día -->
          <h6 class="text-decoration-underline text-center">DISPLAYED TIME</h6>
          <li class="mb-2">
            <i class="fa fa-arrow-right me-1" aria-hidden="true"></i>${balanceHours} hour${balanceHours !== 1 ? 's' : ''}, ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}
          </li>
          <hr>
  
          <!-- Versión y tiempo de ejecución -->
          <li class="mb-2 text-center text-warning">
            <span>Version: ${Version} | ${(performance.now() - startTime).toFixed(4)} ms</span>
          </li>
        </ul>
      </div>`;
  }
  

function getMonthlyValue() {
  const elementMinutes = document.getElementById("tspan753");
  const currentMinutes = parseFloat(elementMinutes.textContent);
  const oldMinutes =
    parseInt(localStorage.getItem("minutes")) || currentMinutes;
  localStorage.setItem("minutes", currentMinutes);

  minutesAdded = currentMinutes - oldMinutes;
  if (minutesAdded > 0) {
    localStorage.setItem("lastminutevalid", minutesAdded);
    localStorage.setItem("datevalid", currentDate);
  }
  return (currentMinutes * mValue).toFixed(2);
}

function getSavedValue() {
  const velocimetroDiv = document.getElementById("velocimetro");

  if (velocimetroDiv) {
    const content = velocimetroDiv.innerText || velocimetroDiv.textContent;

    const indexOfText = content.indexOf("TOTAL ACUMULADO:");

    if (indexOfText !== -1) {
      const startIndex = indexOfText + "TOTAL ACUMULADO:".length;
      const endIndex = content.indexOf("€", startIndex);

      return parseFloat(
        content.substring(startIndex, endIndex).replace(",", ".")
      );
    }
  }

  return 0.0;
}

function getMinutesDay() {
  const elementMinutes = document.getElementById("tspan753");
  return parseFloat(elementMinutes.textContent);
}

function formatdate(time) {
  return new Date(time).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function get_total_day() {
  const minutesday = localStorage.getItem("minutesday") || "";
  if (minutesday.length <= 0) return 0;
  const parts = minutesday.split("_");
  if (parts.length >= 2) {
    const day = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (day == currentDate.getDate()) {
      return minutes;
    }
  }

  return 0;
}

function save_total_day(minutes = 0) {
  localStorage.setItem("minutesday", `${currentDate.getDate()}_${minutes}`);
}

/** [SETTINGS]
 * EXPERIMENTAL
 */

function get_formateset() {
  return `<div class="col-lg-12">
  <div class="col-12">
    <span class="element-4 text-center"><i class="fa fa-cog" aria-hidden="true"></i> HK Settings</span>
    <span class="elementor-3"></span>
  </div>
  <ul class="list-unstyled">
    <li class="mb-2">
      <div class="mb-3">
        <label for="urlBg" class="form-label">URL BG</label>
        <input type="text" class="form-control" id="urlBg" value="${urlBg}"/>
      </div>
    </li>
    <li class="mb-2">
      <div class="mb-3">
        <label for="mValue" class="form-label">Minutes Values</label>
        <input type="text" class="form-control" id="mValue" value="${mValue}"/>
      </div>
    </li>
    <li class="mb-2">
      <div class="mb-3">
        <label for="WithdrawalVal" class="form-label">Minimum Withdrawal</label>
        <input type="text" class="form-control" id="WithdrawalVal" value="${WithdrawalVal}"/>
      </div>
    </li>
    <li class="mb-2">
      <div class="mb-3">
        <button type="button" class="btn btn-success" id="hkupdate">UPDATE</button>
      </div>
    </li>
    <li class="mb-2 text-decoration-underline text-center text-danger">
    <span >reload forced</span>
    </li>
    <hr>
    <h6 class="text-decoration-underline text-center">AUTO RELOAD</h6>
    <li class="mb-2 text-cente">
    <div class="mb-3 align-items-center">
      <button type="button" class="btn btn-${autoreload === 1 ? "danger":"info"}" id="hkautoreload">${autoreload === 1 ? "DESACTIVAR":"ACTIVAR"}</button>
    </div>
  </li>
  </ul>
</div>`;
}

const hkupdate = document.getElementById("hkupdate");
hkupdate.addEventListener("click", updatesettings);

function updatesettings() {
  const mValueForm = document.getElementById("mValue");
  localStorage.setItem("mValue", mValueForm.value);

  const urlBgForm = document.getElementById("urlBg");
  localStorage.setItem("urlBg", urlBgForm.value);

  const WithdrawalVal = document.getElementById("WithdrawalVal");
  localStorage.setItem("WithdrawalVal", WithdrawalVal.value);

  location.reload();
}

// EXPERIMENTAL AUTO RELOAD
const hkautoreloadbtn = document.getElementById("hkautoreload");
hkautoreloadbtn.addEventListener("click", hkautoreload);

function hkautoreload()
{
  localStorage.setItem("autoreload", autoreload === 0 ? 1 : 0);
  location.reload();
}

if (autoreload === 1)
{
  setTimeout(() => {
    location.reload();
  }, 8000);
}
