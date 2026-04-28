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
            // -- CONTENEDOR PRINCIPAL DE LA UNIDAD (TARJETA) --
            const unitCard = document.createElement("div");
            unitCard.className = "unit-card";

            // -- HEADER DE LA UNIDAD --
            const unitHeader = document.createElement("div");
            unitHeader.className = "unit-header";

            const iconTitleWrapper = document.createElement("div");
            iconTitleWrapper.className = "unit-icon-title";

            const iconDiv = document.createElement("div");
            iconDiv.textContent = "📁";
            iconDiv.style.fontSize = "26px";

            const titleElement = document.createElement("h3");
            titleElement.className = "unit-title";
            titleElement.textContent = unidad.nombre; // Ej: "Unidad 1"

            iconTitleWrapper.appendChild(iconDiv);
            iconTitleWrapper.appendChild(titleElement);

            const chevronDiv = document.createElement("div");
            chevronDiv.className = "chevron-icon";
            chevronDiv.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

            unitHeader.appendChild(iconTitleWrapper);
            unitHeader.appendChild(chevronDiv);
            unitCard.appendChild(unitHeader);

            // -- CONTENEDOR DESPLEGABLE (ACORDEÓN) --
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "unit-content-wrapper";

            const contentInner = document.createElement("div");
            contentInner.className = "unit-content";

            // Obtener semanas correspondientes a la unidad actual
            const semanasDeEstaUnidad = semanasPorUnidad[unidad.id] || [];

            if (semanasDeEstaUnidad.length === 0) {
                const noWeeksMsg = document.createElement("p");
                noWeeksMsg.style.color = "#64748b";
                noWeeksMsg.style.fontStyle = "italic";
                noWeeksMsg.textContent = "No hay semanas publicadas para esta unidad.";
                contentInner.appendChild(noWeeksMsg);
            } else {
                semanasDeEstaUnidad.forEach(semana => {
                    const weekCard = document.createElement("div");
                    weekCard.className = "week-card";

                    const wTitle = document.createElement("h4");
                    wTitle.textContent = semana.titulo;
                    wTitle.style.marginBottom = "5px";
                    wTitle.style.color = "#0f172a";

                    const wDesc = document.createElement("p");
                    wDesc.textContent = semana.descripcion || "Sin descripción proporcionada.";
                    wDesc.style.color = "#475569";
                    wDesc.style.fontSize = "0.95rem";

                    weekCard.appendChild(wTitle);
                    weekCard.appendChild(wDesc);

                    const trabajosDeEstaSemana = (trabajos || []).filter(t => t.semana_id == semana.id);

                    if (trabajosDeEstaSemana.length > 0) {
                        const worksContainer = document.createElement("div");
                        worksContainer.style.marginTop = "1rem";

                        trabajosDeEstaSemana.forEach((trabajo) => {
                            const fileCard = document.createElement("div");
                            fileCard.className = "file-card";

                            const fileInfo = document.createElement("div");
                            fileInfo.className = "file-info";

                            const fIcon = document.createElement("div");
                            fIcon.className = "file-icon";
                            fIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;

                            const textWrapper = document.createElement("div");
                            const fTitle = document.createElement("div");
                            fTitle.textContent = trabajo.titulo || "Documento adjunto";
                            fTitle.style.fontWeight = "600";
                            fTitle.style.color = "#1e293b";
                            fTitle.style.marginBottom = "2px";

                            textWrapper.appendChild(fTitle);

                            if (trabajo.descripcion) {
                                const fDesc = document.createElement("div");
                                fDesc.textContent = trabajo.descripcion;
                                fDesc.style.fontSize = "0.85rem";
                                fDesc.style.color = "#64748b";
                                textWrapper.appendChild(fDesc);
                            }

                            fileInfo.appendChild(fIcon);
                            fileInfo.appendChild(textWrapper);
                            fileCard.appendChild(fileInfo);

                            if (trabajo.pdf_url) {
                                const actionsDiv = document.createElement("div");
                                actionsDiv.className = "file-actions";

                                const btnView = document.createElement("a");
                                btnView.className = "btn-file btn-view";
                                btnView.href = trabajo.pdf_url;
                                btnView.target = "_blank";
                                btnView.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> Ver`;

                                const btnDownload = document.createElement("button");
                                btnDownload.className = "btn-file btn-download";
                                btnDownload.style.cursor = "pointer";
                                btnDownload.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> Descargar`;
                                btnDownload.onclick = async (e) => {
                                    e.preventDefault();
                                    try {
                                        const originalText = btnDownload.innerHTML;
                                        btnDownload.innerHTML = "Descargando...";
                                        
                                        // Obtener nombre limpio del archivo
                                        let fileName = trabajo.pdf_url.split('/').pop().split('?')[0];
                                        try { fileName = decodeURIComponent(fileName); } catch (err) { }
                                        fileName = fileName.replace(/^\d+_/, '').replace(/_/g, ' ') || "archivo.pdf";

                                        // Usar fetch para forzar descarga sin abrir en otra pestaña
                                        const response = await fetch(trabajo.pdf_url);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        
                                        const a = document.createElement('a');
                                        a.style.display = 'none';
                                        a.href = url;
                                        a.download = fileName;
                                        document.body.appendChild(a);
                                        a.click();
                                        
                                        window.URL.revokeObjectURL(url);
                                        a.remove();
                                        btnDownload.innerHTML = originalText;
                                    } catch (err) {
                                        console.error("Error al descargar, abriendo link directo:", err);
                                        // Fallback si falla CORS
                                        window.open(trabajo.pdf_url + (trabajo.pdf_url.includes('?') ? '&' : '?') + "download=", '_self');
                                    }
                                };

                                actionsDiv.appendChild(btnView);
                                actionsDiv.appendChild(btnDownload);
                                fileCard.appendChild(actionsDiv);
                            }

                            worksContainer.appendChild(fileCard);
                        });
                        weekCard.appendChild(worksContainer);
                    }
                    contentInner.appendChild(weekCard);
                });
            }

            // Integrar acordeón
            contentWrapper.appendChild(contentInner);
            unitCard.appendChild(contentWrapper);

            // Logica de evento de click
            unitHeader.addEventListener('click', () => {
                unitCard.classList.toggle('active');
            });

            accordion.appendChild(unitCard);
        });

    } catch (err) {
        console.error("Error inesperado en script.js:", err);
        accordion.innerHTML = `<p style="color: red;">Error crítico de sistema.</p>`;
    }
});
