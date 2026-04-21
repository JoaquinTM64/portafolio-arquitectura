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

        const { data: trabajos, error: errorTrabajos } = await supabase
            .from("trabajos")
            .select("*")
            .order('created_at', { ascending: true });

        // Manejar errores correctamente
        if (errorUnidades || errorSemanas || errorTrabajos) {
            console.error("Error al cargar datos:", errorUnidades || errorSemanas || errorTrabajos);
            accordion.innerHTML = `<p style="color: red;">Error al obtener datos: ${(errorUnidades || errorSemanas || errorTrabajos).message}</p>`;
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

                    // Trabajos de la semana
                    const trabajosDeEstaSemana = (trabajos || []).filter(t => t.semana_id == semana.id);

                    if (trabajosDeEstaSemana.length > 0) {
                        const worksContainer = document.createElement("div");
                        worksContainer.style.marginTop = "15px";
                        worksContainer.style.display = "flex";
                        worksContainer.style.flexDirection = "column";
                        worksContainer.style.gap = "8px";

                        trabajosDeEstaSemana.forEach((trabajo, index) => {
                            const workItem = document.createElement("div");
                            workItem.style.backgroundColor = "#ffffff";
                            workItem.style.border = "1px solid #e2e8f0";
                            workItem.style.borderRadius = "8px";
                            workItem.style.padding = "10px 15px";
                            workItem.style.display = "flex";
                            workItem.style.alignItems = "center";
                            workItem.style.justifyContent = "space-between";
                            workItem.style.transition = "all 0.3s ease";
                            workItem.style.cursor = "default";

                            // Hover effect
                            workItem.addEventListener('mouseenter', () => {
                                workItem.style.transform = "translateY(-2px)";
                                workItem.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                                workItem.style.borderColor = "#bae6fd";
                            });
                            workItem.addEventListener('mouseleave', () => {
                                workItem.style.transform = "none";
                                workItem.style.boxShadow = "none";
                                workItem.style.borderColor = "#e2e8f0";
                            });

                            const workInfo = document.createElement("div");
                            workInfo.style.display = "flex";
                            workInfo.style.flexDirection = "column";
                            workInfo.style.gap = "2px";

                            const titleWrapper = document.createElement("div");
                            titleWrapper.style.display = "flex";
                            titleWrapper.style.alignItems = "center";
                            titleWrapper.style.gap = "8px";

                            const icon = document.createElement("span");
                            icon.textContent = "📄";
                            icon.style.fontSize = "1.1rem";

                            const wTitle = document.createElement("span");
                            wTitle.textContent = trabajo.titulo || `Trabajo ${index + 1}`;
                            wTitle.style.fontWeight = "600";
                            wTitle.style.fontSize = "0.9rem";
                            wTitle.style.color = "#334155";

                            titleWrapper.appendChild(icon);
                            titleWrapper.appendChild(wTitle);
                            workInfo.appendChild(titleWrapper);

                            const wDesc = document.createElement("span");
                            wDesc.textContent = trabajo.descripcion || "";
                            wDesc.style.fontSize = "0.75rem";
                            wDesc.style.color = "#64748b";
                            if (wDesc.textContent) workInfo.appendChild(wDesc);

                            workItem.appendChild(workInfo);

                            // Link al pdf si existe
                            if (trabajo.pdf_url) {
                                const actionContainer = document.createElement("div");
                                actionContainer.style.display = "flex";
                                actionContainer.style.flexDirection = "column";
                                actionContainer.style.alignItems = "flex-end";
                                actionContainer.style.gap = "4px";

                                const wLink = document.createElement("a");
                                wLink.href = trabajo.pdf_url;
                                wLink.target = "_blank";
                                wLink.textContent = "Abrir Archivo";
                                wLink.style.backgroundColor = "#e0f2fe";
                                wLink.style.color = "#0369a1";
                                wLink.style.padding = "6px 14px";
                                wLink.style.borderRadius = "6px";
                                wLink.style.fontSize = "0.75rem";
                                wLink.style.fontWeight = "600";
                                wLink.style.textDecoration = "none";
                                wLink.style.transition = "background-color 0.2s, transform 0.1s";
                                wLink.addEventListener('mouseenter', () => { wLink.style.backgroundColor = "#bae6fd"; wLink.style.transform = "scale(1.02)"; });
                                wLink.addEventListener('mouseleave', () => { wLink.style.backgroundColor = "#e0f2fe"; wLink.style.transform = "none"; });
                                wLink.addEventListener('mousedown', () => wLink.style.transform = "scale(0.95)");
                                wLink.addEventListener('mouseup', () => wLink.style.transform = "scale(1.02)");

                                actionContainer.appendChild(wLink);

                                // Nombre limpio del archivo
                                let fileName = trabajo.pdf_url.split('/').pop().split('?')[0];
                                try { fileName = decodeURIComponent(fileName); } catch (e) { }
                                fileName = fileName.replace(/^\d+_/, '').replace(/_/g, ' ');

                                if (fileName) {
                                    const wFileName = document.createElement("span");
                                    wFileName.textContent = fileName;
                                    wFileName.style.fontSize = "0.65rem";
                                    wFileName.style.color = "#94a3b8";
                                    wFileName.style.maxWidth = "150px";
                                    wFileName.style.overflow = "hidden";
                                    wFileName.style.textOverflow = "ellipsis";
                                    wFileName.style.whiteSpace = "nowrap";
                                    actionContainer.appendChild(wFileName);
                                }

                                workItem.appendChild(actionContainer);
                            }

                            worksContainer.appendChild(workItem);
                        });

                        weekCard.appendChild(worksContainer);
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
