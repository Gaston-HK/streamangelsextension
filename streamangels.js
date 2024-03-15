/**
 * 0.2
 * - Allow the client to modify "eurValue" ✔
 * - Allow the client to modify "mValue" ✔
 * - Allow the client to modify "urlBg" ✔
 * - Support for indicating the currency type (experimental) ☢
 * 
 *  * 0.2.1
 * - Auto Reload
 *
 * 0.3
 * To-Do:
 * - Help pop-ups (no alerts)
 *
 * 0.3.1
 * - Add a button to clear "localStorage"
 * - Text corrections for better clarity
 */

// "";

const startTime = performance.now();
const currencyFormat = ["USD", "ARS"];
const currencyType = parseInt(localStorage.getItem("typeCurrency") || -1);
const autoreload = parseInt(localStorage.getItem("autoreload") || 0);
const currentDate = new Date();
const Version = "0.2.1 [ALPHA]";
const eurValue = get_euro_value();
const mValue = parseFloat(localStorage.getItem("mValue") || 0.004);
const urlBg = localStorage.getItem("urlBg") || "";
const divReference = document.getElementById("alimetro");
const extensionElement = document.createElement("div");
extensionElement.id = "HKExtension";
extensionElement.innerHTML = getFormattedDiv();
extensionElement.classList.add("row", "mt-4", "p-3", "box-4");
if (urlBg != "") {
  extensionElement.style.background = `url('${urlBg}') no-repeat center`;
  extensionElement.style.backgroundSize = "cover";
}
divReference.parentNode.insertBefore(
  extensionElement,
  divReference.nextSibling
);

const newSettings = document.createElement("div");
newSettings.id = "HKSettings";
newSettings.innerHTML = get_formateset();
newSettings.classList.add("row", "mt-4", "p-3", "box-4");
extensionElement.parentNode.insertBefore(
  newSettings,
  extensionElement.nextSibling
);

var minutesAdded = 0;

function getFormattedDiv() {
  const lastupdate = currentDate.toString();
  const balance = parseFloat(getSavedValue());
  const toAdd = parseFloat(getMonthlyValue());
  const total = (balance + toAdd).toFixed(2);
  const formattedDate = formatdate(lastupdate);
  const lastupdatevalid = localStorage.getItem("datevalid") || "0";
  const lastminutevalid =
    parseInt(localStorage.getItem("lastminutevalid")) || 0;
  const formattedDateValid = formatdate(lastupdatevalid);
  const totalDay = get_total_day() + minutesAdded;
  save_total_day(totalDay);

  const textlast = `<hr>
    <h6 class="text-decoration-underline text-center">LAST GEM COLLECTED</h6>
    <li class="mb-2">
      <i class="fa fa-arrow-right" aria-hidden="true"></i> Last Minutes (valid): ${lastminutevalid}
    </li> 
    <li class="mb-2">
      <i class="fa fa-arrow-right" aria-hidden="true"></i> Last update (valid): ${formattedDateValid}
    </li>`;

  return `<div class="col-lg-12">
    <div class="col-12">
      <span class="element-4 text-center"><i class="fa fa-info-circle" aria-hidden="true"></i>
       HK Extension</span>
      <span class="elementor-3"></span>
    </div>
    <ul class="list-unstyled">
      <h6 class="text-decoration-underline text-center">TOTAL MONEY FOR THE DAY</h6>
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Day Balance: ${toAdd.toFixed(
          2
        )} <i class="fa fa-eur" aria-hidden="true"></i>
      </li>
      <li class="mb-2" ${currencyType === -1 ? 'style="display: none"' : ""}>
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Day Balance: ${parseFloat(
          toAdd * eurValue
        ).toFixed(2)} ${currencyFormat[Math.max(0, currencyType)]}
      </li>
      <hr>
      <h6 class="text-decoration-underline text-center">TOTAL MONEY</h6>
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Total Balance: ${total} <i class="fa fa-eur" aria-hidden="true"></i>
      </li>
      <li class="mb-2" ${currencyType === -1 ? 'style="display: none"' : ""}>
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Total Balance: ${parseFloat(
          total * eurValue
        ).toFixed(2)} ${currencyFormat[Math.max(0, currencyType)]}
      </li>
      <hr>
      <h6 class="text-decoration-underline text-center">VALUES</h6>
      <li class="mb-2" ${currencyType === -1 ? 'style="display: none"' : ""}>
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Value of EURO: ${eurValue} ${
    currencyFormat[Math.max(0, currencyType)]
  }
      </li>
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Value of Minute: ${mValue}
      </li>
      <hr>
      <h6 class="text-decoration-underline text-center">RELOAD INFORMATION</h6>
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Added minutes: ${minutesAdded}
      </li>
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Last Refresh: ${formattedDate}
      </li>
      ${lastminutevalid > 0 ? textlast : ""}
      <hr>
      <h6 class="text-decoration-underline text-center">MINUTES DAY</h6>
      <li class="mb-2">
        <i class="fa fa-arrow-right" aria-hidden="true"></i> Total minutes of the day: ${totalDay}
      </li>
      <hr>
      <li class="mb-2 text-center text-warning">
        <span>Version: ${Version} | ${(performance.now() - startTime).toFixed(
    4
  )} ms</span>
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
        <label for="typeCurrency" class="form-label">Type Currency</label>
        <select class="form-select" id="typeCurrency">
          <option value="-1" ${
            currencyType === -1 ? "selected" : ""
          }>NINGUNA</option>
          <option value="0" ${
            currencyType === 0 ? "selected" : ""
          }>USD (Dólar estadounidense)</option>
          <option value="1" ${
            currencyType === 1 ? "selected" : ""
          }>ARS (Peso argentino)</option>
        </select>
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

function get_euro_value() {
  if (currencyType === -1)
    // None
    return 1.0;
  else if (currencyType === 0)
    // USD
    return 1.09;
  else if (currencyType === 1)
    // ARS
    return 994.8467;

  return 1.0;
}

const hkupdate = document.getElementById("hkupdate");
hkupdate.addEventListener("click", updatesettings);

function updatesettings() {
  const typeCurrencyForm = document.getElementById("typeCurrency");
  localStorage.setItem("typeCurrency", typeCurrencyForm.value);

  const mValueForm = document.getElementById("mValue");
  localStorage.setItem("mValue", mValueForm.value);

  const urlBgForm = document.getElementById("urlBg");
  localStorage.setItem("urlBg", urlBgForm.value);

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