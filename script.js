(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    let id = 0;
    function parking() {
        function readCar() {
            return localStorage.parking ? JSON.parse(localStorage.parking) : [];
        }
        function saveCar(vehicles) {
            localStorage.setItem("parking", JSON.stringify(vehicles));
        }
        function createCar(vehicle) {
            var _a, _b;
            const rowCar = document.createElement("tr");
            rowCar.innerHTML = `
                <td>${vehicle.name.toUpperCase()}</td>
                <td>${vehicle.bland.toUpperCase()}</td>
                <td>${vehicle.plateLicense}</td>
                <td>${vehicle.entry}</td>
                <td>
                    <button class="delete" data-place="${vehicle.plateLicense}"> Finalizar </button>
                </td>
            `;
            (_a = rowCar.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                console.log(`this: ${vehicle.plateLicense}`);
                removeCar(vehicle.plateLicense);
            });
            (_b = $("#parking-lot")) === null || _b === void 0 ? void 0 : _b.appendChild(rowCar);
            return vehicle;
        }
        function removeCar(plateLicense) {
            console.log(readCar());
            const vehicle = readCar().find(vehicle => vehicle.plateLicense === plateLicense);
            console.log(vehicle);
            const time = calcTime(new Date().getTime() - new Date(vehicle.entry).getTime());
            if (!confirm(`O veículo ${vehicle.name} permaneceu ${time} no estacionamento. Deseja encerrar?`)) {
                return;
            }
            console.log(readCar());
            saveCar(readCar().filter((car) => {
                if (car.plateLicense !== plateLicense) {
                    return car;
                }
            }));
            toPay(parseFloat(time));
            console.log(readCar());
            renderCar();
        }
        function toPay(time) {
            let totalPay = 0.5 * time;
            if (confirm(`O cliente possui cupom?`)) {
                totalPay = cupom(totalPay);
            }
            alert(`O total a ser pago é: R$ ${totalPay.toFixed(2)}`);
        }
        function cupom(totalPay) {
            if (cupom) {
                totalPay = totalPay * 0.8;
            }
            return totalPay;
        }
        function calcTime(time) {
            const min = Math.floor(time / 60000);
            return `${min} minutos`;
        }
        function addCar(vehicle) {
            let newCar = createCar(vehicle);
            saveCar([...readCar(), newCar]);
            clear();
        }
        function renderCar() {
            $("#parking-lot").innerHTML = "";
            const parking = readCar();
            if (parking.length) {
                parking.forEach((vehicle) => createCar(vehicle));
            }
        }
        function clear() {
            $('#name-client').value = "";
            $('#name-car').value = "";
            $('#plate-license').value = "";
        }
        return { readCar, addCar, removeCar, saveCar, renderCar };
    }
    parking().renderCar();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
        var _a, _b, _c;
        event.preventDefault();
        const name = ((_a = $("#name-client")) === null || _a === void 0 ? void 0 : _a.value);
        const bland = ((_b = $("#name-car")) === null || _b === void 0 ? void 0 : _b.value);
        const plateLicense = (_c = $("#plate-license")) === null || _c === void 0 ? void 0 : _c.value;
        if (!name || !plateLicense) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        id = ++id;
        parking().addCar({ name, bland, plateLicense, entry: new Date().toISOString() });
    });
})();
