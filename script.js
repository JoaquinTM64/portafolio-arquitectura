/**
 * script.js - Lógica dinámica e interacción del portafolio.
 * Implementa la persistencia de datos (localStorage) y el manejo de estados de las tarjetas.
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. DATO PRINCIPAL: Array de objetos por semana (Modularidad)
    const semanasData = [
        { id: 1, title: "Semana 1", desc: "Introducción a los conceptos fundamentales de la arquitectura y el rol del arquitecto en el ciclo de vida." },
        { id: 2, title: "Semana 2", desc: "Atributos de calidad y requerimientos no funcionales. Definición de escenarios de arquitectura." },
        { id: 3, title: "Semana 3", desc: "Estilos arquitectónicos y patrones fundamentales. Monolitos vs Sistemas Distribuidos." },
        { id: 4, title: "Semana 4", desc: "Modelado C4 y vistas arquitectónicas. Documentación técnica de alto nivel." },
        { id: 5, title: "Semana 5", desc: "Principios SOLID y patrones de diseño aplicados a la arquitectura de componentes." },
        { id: 6, title: "Semana 6", desc: "Arquitectura orientada a servicios (SOA) y el auge de los microservicios." },
        { id: 7, title: "Semana 7", desc: "Gestión de datos en arquitecturas distribuidas: CQRS y Event Sourcing." },
        { id: 8, title: "Semana 8", desc: "Seguridad en la arquitectura. Implementación de OAuth2 y JWT." },
        { id: 9, title: "Semana 9", desc: "Infraestructura como código (IaC) y orquestación de contenedores con Kubernetes." },
        { id: 10, title: "Semana 10", desc: "Estrategias de despliegue: Blue-Green, Canary y Rolling Updates." },
        { id: 11, title: "Semana 11", desc: "Monitoreo y observabilidad en sistemas complejos. Logs y tracing." },
        { id: 12, title: "Semana 12", desc: "Presentación final y evaluación de arquitecturas propuestas durante el curso." }
    ];

    // 2. CONFIGURACIÓN DEL SISTEMA DE ESTADOS
    const STORAGE_KEY = "digital_blueprint_states";
    const estadoSecuencia = ["pending", "in-progress", "review", "completed"];

    // Textos legibles correspondientes a cada estado de UI
    const etiquetasEstado = {
        "pending": "PENDING",
        "in-progress": "IN PROGRESS",
        "review": "REVIEW",
        "completed": "COMPLETED"
    };

    /**
     * Recupera el progreso almacenado en localStorage, o crea un mapeo inicial.
     */
    function loadStates() {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            try {
                return JSON.parse(localData);
            } catch (e) {
                console.error("Error leyendo localStorage, reiniciando datos.");
            }
        }
        
        // Estado por defecto inicial basado en la maqueta visual:
        let initialState = {};
        semanasData.forEach(semana => {
            // Ejemplo para replicar el mockup si no hay datos.
            // Semana 1 (In progress/Active), Semanas 2-3 (Completed), Semana 4 (Review), otras pending.
            if(semana.id === 1) initialState[semana.id] = "in-progress";
            else if(semana.id === 2 || semana.id === 3 || semana.id === 5) initialState[semana.id] = "completed";
            else if(semana.id === 4) initialState[semana.id] = "review";
            else initialState[semana.id] = "pending";
        });
        
        return initialState;
    }

    const currentStates = loadStates();

    /**
     * Persiste los estados actuales permanentemente en la computadora del usuario.
     */
    function saveStates() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStates));
    }

    /**
     * Avanza al siguiente nivel en el ciclo de trabajo circularmente.
     */
    function getNextState(currentState) {
        const currentIndex = estadoSecuencia.indexOf(currentState);
        const nextIndex = (currentIndex + 1) % estadoSecuencia.length;
        return estadoSecuencia[nextIndex];
    }

    // 3. GENERACIÓN DINÁMICA DE LA INTERFAZ
    const gridSemanas = document.getElementById("gridSemanas");

    function renderPortfolio() {
        // Asegurar contenedor limpio
        gridSemanas.innerHTML = "";

        semanasData.forEach(semana => {
            const currentState = currentStates[semana.id];
            
            // Formatear el número de semana a un mínimo de dos dígitos (ej. "01")
            const numeroFormateado = semana.id.toString().padStart(2, '0');

            // Crear el DOM element para la tarjeta
            const cardElement = document.createElement("div");
            cardElement.className = "card";
            cardElement.setAttribute("role", "button");
            cardElement.setAttribute("aria-label", `Gestionar progreso de ${semana.title}`);
            
            cardElement.innerHTML = `
                <div class="card-top">
                    <!-- Badge de Estado (El color depende de la clase currentState) -->
                    <span class="badge ${currentState}">${etiquetasEstado[currentState]}</span>
                    <span class="card-number">${numeroFormateado}</span>
                </div>
                <h4>${semana.title}</h4>
                <p>${semana.desc}</p>
                <button class="btn-secondary">Ver trabajo &rarr;</button>
            `;

            // 🔹 Evento SOLO para la tarjeta (cambiar estado)
cardElement.addEventListener("click", () => {
    const nuevoEstado = getNextState(currentStates[semana.id]);
    
    currentStates[semana.id] = nuevoEstado;
    saveStates();

    const badge = cardElement.querySelector(".badge");
    badge.className = "badge " + nuevoEstado;
    badge.textContent = etiquetasEstado[nuevoEstado];

    // Animación
    cardElement.style.transform = "scale(0.96)";
    setTimeout(() => {
        cardElement.style.transform = ""; 
    }, 150);
});


// 🔹 Evento SOLO para el botón (navegar)
const button = cardElement.querySelector(".btn-secondary");

button.addEventListener("click", (e) => {
    e.stopPropagation(); // 🚨 evita que active la card
    window.location.href = `semana${semana.id}.html`;
});

            // Adherir al layout maestro
            gridSemanas.appendChild(cardElement);
        });
    }

    // Inicializar todo
    renderPortfolio();
});
