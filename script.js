document.addEventListener("DOMContentLoaded", async () => {
    // 1. Conectarse a Supabase
    const supabaseUrl = "https://iacjmzaihvzjotehsdjd.supabase.co";
    const supabaseKey = "sb_publishable_CJnhBJENcZ5EyjTasNQriA_Ka4FHCtB";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Obtener el contenedor HTML
    const accordion = document.getElementById("accordionSemanas");

    if (!accordion) {
        console.error("No se encontró el DIV con id 'accordionSemanas'");
        return;
    }

    try {
        // Indicador de carga
        accordion.innerHTML = "<p>Cargando información del portafolio...</p>";

        // 2. Obtener todas las unidades (ordenadas numéricamente) y las semanas
        const { data: unidades, error: errorUnidades } = await supabase
            .from("unidades")
            .select("*")
            .order('id', { ascending: true });

        const { data: semanas, error: errorSemanas } = await supabase
            .from("semanas")
            .select("*")
            .order('id', { ascending: true });

        // Manejar errores correctamente
        if (errorUnidades || errorSemanas) {
            console.error("Error al cargar datos:", errorUnidades || errorSemanas);
            accordion.innerHTML = `<p style="color: red;">Error al obtener datos: ${(errorUnidades || errorSemanas).message}</p>`;
            return;
        }

        // Limpiar indicador de carga
        accordion.innerHTML = "";

        // Validar si la base de datos de unidades está vacía
        if (!unidades || unidades.length === 0) {
            accordion.innerHTML = "<p>No hay unidades creadas.</p>";
            return;
        }

        // 3. Agrupar semanas por unidad (key = unidad_id)
        const semanasPorUnidad = {};
        if (semanas) {
            semanas.forEach(semana => {
                if (!semanasPorUnidad[semana.unidad_id]) {
                    semanasPorUnidad[semana.unidad_id] = [];
                }
                semanasPorUnidad[semana.unidad_id].push(semana);
            });
        }

        // 4. Render correcto en el DOM
        unidades.forEach((unidad) => {
            // -- CONTENEDOR PRINCIPAL DE LA UNIDAD --
            const unitSection = document.createElement("div");
            unitSection.style.marginBottom = "30px";
            unitSection.style.fontFamily = "system-ui, -apple-system, sans-serif";

            // -- TARJETA DE LA UNIDAD --
            const card = document.createElement("div");
            card.style.border = "1px solid #e0e0e0";
            card.style.borderRadius = "10px";
            card.style.padding = "20px";
            card.style.backgroundColor = "#ffffff";
            card.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            card.style.display = "flex";
            card.style.alignItems = "center";

            // Icono de carpeta
            const iconDiv = document.createElement("div");
            iconDiv.textContent = "📁";
            iconDiv.style.fontSize = "26px";
            iconDiv.style.marginRight = "15px";

            // Título de la unidad
            const titleBlock = document.createElement("div");
            const titleElement = document.createElement("h3");
            titleElement.style.margin = "0";
            titleElement.style.fontSize = "1.2rem";
            titleElement.style.color = "#333333";
            titleElement.textContent = unidad.nombre; // Ej: "Unidad 1"

            titleBlock.appendChild(titleElement);
            card.appendChild(iconDiv);
            card.appendChild(titleBlock);

            // Agregar la tarjeta de unidad a la sección
            unitSection.appendChild(card);

            // -- CONTENEDOR DE LAS SEMANAS DE ESTA UNIDAD --
            const weeksContainer = document.createElement("div");
            weeksContainer.style.paddingLeft = "25px";
            weeksContainer.style.marginTop = "15px";
            weeksContainer.style.display = "flex";
            weeksContainer.style.flexDirection = "column";
            weeksContainer.style.gap = "15px";

            // Obtener semanas correspondientes a la unidad actual
            const semanasDeEstaUnidad = semanasPorUnidad[unidad.id] || [];

            if (semanasDeEstaUnidad.length === 0) {
                // Mensaje si no hay semanas
                const noWeeksMsg = document.createElement("p");
                noWeeksMsg.style.color = "#888";
                noWeeksMsg.style.fontSize = "0.9rem";
                noWeeksMsg.style.fontStyle = "italic";
                noWeeksMsg.textContent = "No hay semanas publicadas para esta unidad.";
                weeksContainer.appendChild(noWeeksMsg);
            } else {
                // Renderizar cada semana
                semanasDeEstaUnidad.forEach(semana => {
                    const weekCard = document.createElement("div");
                    weekCard.style.borderLeft = "3px solid #0062a1"; // Línea de acento
                    weekCard.style.padding = "15px 20px";
                    weekCard.style.backgroundColor = "#f8fafc";
                    weekCard.style.borderRadius = "0 8px 8px 0";
                    weekCard.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";

                    // Título de la Semana
                    const wTitle = document.createElement("h4");
                    wTitle.textContent = semana.titulo;
                    wTitle.style.margin = "0 0 5px 0";
                    wTitle.style.fontSize = "1rem";
                    wTitle.style.color = "#1e293b";

                    // Descripción de la Semana
                    const wDesc = document.createElement("p");
                    wDesc.textContent = semana.descripcion || "Sin descripción proporcionada.";
                    wDesc.style.margin = "0 0 10px 0";
                    wDesc.style.fontSize = "0.85rem";
                    wDesc.style.color = "#475569";

                    weekCard.appendChild(wTitle);
                    weekCard.appendChild(wDesc);

                    // Si existe un archivo adjunto (PDF / Link)
                    if (semana.pdf_url) {
                        const linkContainer = document.createElement("div");
                        linkContainer.style.marginTop = "5px";
                        linkContainer.style.display = "flex";
                        linkContainer.style.flexDirection = "column";
                        linkContainer.style.gap = "4px";

                        const wLink = document.createElement("a");
                        wLink.href = semana.pdf_url;
                        wLink.target = "_blank"; // Abrir en nueva pestaña
                        wLink.style.display = "inline-flex";
                        wLink.style.alignItems = "center";
                        wLink.style.gap = "6px";
                        wLink.style.color = "#0062a1";
                        wLink.style.fontSize = "0.85rem";
                        wLink.style.fontWeight = "600";
                        wLink.style.textDecoration = "none";
                        wLink.textContent = "📄 Abrir archivo";

                        linkContainer.appendChild(wLink);

                        // Extraer y mostrar el nombre del archivo
                        let fileName = semana.pdf_url.split('/').pop().split('?')[0];
                        try {
                            fileName = decodeURIComponent(fileName);
                        } catch (e) {
                            // Ignorar si no se puede decodificar
                        }

                        // Formatear el nombre del archivo para mejor legibilidad:
                        // 1. Elimina el prefijo del timestamp numérico (ej. 1776741798185_)
                        fileName = fileName.replace(/^\d+_/, '');
                        // 2. Reemplaza los guiones bajos restantes por espacios
                        fileName = fileName.replace(/_/g, ' ');

                        if (fileName && fileName.trim() !== "") {
                            const wFileName = document.createElement("span");
                            wFileName.textContent = `Archivo: ${fileName}`;
                            wFileName.style.fontSize = "0.8rem";
                            wFileName.style.color = "#64748b"; // Gris sutil
                            wFileName.style.wordBreak = "break-all";

                            linkContainer.appendChild(wFileName);
                        }

                        weekCard.appendChild(linkContainer);
                    }

                    weeksContainer.appendChild(weekCard);
                });
            }

            // Anidar todo
            unitSection.appendChild(weeksContainer);
            accordion.appendChild(unitSection);
        });

    } catch (err) {
        console.error("Error inesperado en script.js:", err);
        accordion.innerHTML = `<p style="color: red;">Error crítico de sistema.</p>`;
    }
});
