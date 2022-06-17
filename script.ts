interface Vehicle{
    name: string;
    bland: string;
    plateLicense: string;
    entry: Date | string;
}

(function(){
    const $ = (query: string) : any => document.querySelector(query);
    let id = 0;
    
    function parking() {
        function readCar(): Vehicle[]{
            return localStorage.parking ? JSON.parse(localStorage.parking) : [];
        }
            
        function saveCar(vehicles: Vehicle[]) {
            localStorage.setItem("parking", JSON.stringify(vehicles));
        }

        function createCar(vehicle: Vehicle): Vehicle{

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

            rowCar.querySelector(".delete")?.addEventListener("click", ()=> {
                console.log(`this: ${vehicle.plateLicense}`);
                removeCar(vehicle.plateLicense);
            });
            
            $("#parking-lot")?.appendChild(rowCar);

            return vehicle;
        }

        function removeCar(plateLicense : string) { 

            console.log(readCar());
            const vehicle = readCar().find(vehicle => vehicle.plateLicense === plateLicense);
            console.log(vehicle);

            const time = calcTime(new Date().getTime() - new Date(vehicle.entry).getTime());
            
            if(
                !confirm(`O veículo ${vehicle.name} permaneceu ${time} no estacionamento. Deseja encerrar?`)
            ){return;}
            console.log(readCar());
            saveCar(readCar().filter((car) => {
            
                if(car.plateLicense !== plateLicense){
                    return car;
                }
            }));
            toPay(parseFloat(time));
            console.log(readCar());
            renderCar();

        }

        function toPay(time: number){
            let totalPay = 0.5 * time;
            if(confirm(`O cliente possui cupom?`)){
                totalPay = cupom(totalPay);
            }
            alert(`O total a ser pago é: R$ ${totalPay.toFixed(2)}`)
        }

        function cupom(totalPay: number): number{
            if(cupom){
                totalPay = totalPay * 0.8;
            }
            return totalPay;
        }

        function calcTime(time: number){
            const min = Math.floor(time/60000);
            return `${min} minutos`;
        }
        
        function addCar(vehicle: Vehicle) {

            let newCar = createCar(vehicle);

            saveCar([...readCar(), newCar]);

            clear();
        }
        
        function renderCar() {
            $("#parking-lot")!.innerHTML = "";

            const parking = readCar();

            if(parking.length){
                parking.forEach((vehicle) => createCar(vehicle));
            }
        }

        function clear(){
            $('#name-client').value = "";
            $('#name-car').value = "";
            $('#plate-license').value = "";
        }
        
        return { readCar, addCar, removeCar, saveCar, renderCar };
    }
    
    parking().renderCar();
    $("#register")?.addEventListener("click", (event: MouseEvent)=>{
        event.preventDefault();
        const name = ($("#name-client")?.value);
        const bland = ($("#name-car")?.value);
        const plateLicense = $("#plate-license")?.value;

        if(!name || !plateLicense){
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        id = ++id;
        parking().addCar({ name, bland, plateLicense, entry: new Date().toISOString()})
    })
    
})();