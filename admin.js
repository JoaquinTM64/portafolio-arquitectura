/**
 * admin.js - Lógica del Panel de Administración con conexión a Supabase.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Referencias a UI
    const nombreUnidadInput = document.getElementById("nombreUnidad");
    const btnCrearUnidad = document.getElementById("btnCrearUnidad");

    const weekUnitSelect = document.getElementById("week-unit-select");
    const weekTitleInput = document.getElementById("week-title-input");
    const btnCreateWeek = document.getElementById("btn-create-week");

    const workUnitSelect = document.getElementById("work-unit-select");
    const workWeekSelect = document.getElementById("work-week-select");
    const workTitleInput = document.getElementById("work-title-input");
    const workDescInput = document.getElementById("work-desc-input");
    const workFileInput = document.getElementById("work-file-input");
    const btnUploadWork = document.getElementById("btn-upload-work");

    const treeContainer = document.getElementById("tree-container");

    // Recargar UI local
    let units = [];
    let weeks = [];
    let trabajos = [];

    // 1. Cargar Datos Iniciales Dinámicamente
    async function fetchData() {
        const { data: unidades, error: errUnits } = await supabaseClient.from('unidades').select('*').order('created_at', { ascending: true });
        const { data: semanas, error: errWeeks } = await supabaseClient.from('semanas').select('*').order('created_at', { ascending: true });
        const { data: trabs, error: errTrabajos } = await supabaseClient.from('trabajos').select('*').order('created_at', { ascending: true });

        if (errUnits) console.error("Error al cargar unidades:", errUnits);
        if (errWeeks) console.error("Error al cargar semanas:", errWeeks);
        if (errTrabajos) console.error("Error al cargar trabajos:", errTrabajos);

        units = unidades || [];
        weeks = semanas || [];
        trabajos = trabs || [];

        renderSelects();
        renderTree();
    }

    // 2. Poblar opciones de los menús desplegables
    function renderSelects() {
        const unitOptions = '<option value="">Selecciona unidad...</option>' +
            units.map(u => `<option value="${u.id}">${u.nombre}</option>`).join("");

        // Guardamos el state actual seleccionado si existiese para no borrarlo en recargas
        const currentWUnit = weekUnitSelect.value;
        const currentWorkUnit = workUnitSelect.value;

        weekUnitSelect.innerHTML = unitOptions;
        workUnitSelect.innerHTML = unitOptions;

        if (currentWUnit) weekUnitSelect.value = currentWUnit;
        if (currentWorkUnit) {
            workUnitSelect.value = currentWorkUnit;
            populateWorkWeeks(currentWorkUnit);
        }
    }

    // Actualiza el select de semanas de la seccion de Trabajos cuando la unidad cambia
    function populateWorkWeeks(unidad_id) {
        const options = '<option value="">Selecciona semana...</option>' +
            weeks.filter(w => w.unidad_id == unidad_id).map(w => `<option value="${w.id}">${w.titulo}</option>`).join("");
        workWeekSelect.innerHTML = options;
    }
    workUnitSelect.addEventListener('change', () => populateWorkWeeks(workUnitSelect.value));

    // 3. Renderizar el Árbol de Estado
    function renderTree() {
        if (!treeContainer) return;
        treeContainer.innerHTML = "";

        units.forEach((u, i) => {
            const unitNode = document.createElement('div');
            unitNode.className = "space-y-4";

            const weeksOfUnit = weeks.filter(w => w.unidad_id == u.id);

            let weeksHTML = "";
            weeksOfUnit.forEach(w => {
                const trabajosOfWeek = trabajos.filter(t => t.semana_id == w.id);

                let trabajosHTML = "";
                if (trabajosOfWeek.length > 0) {
                    trabajosHTML = `<div class="ml-12 mt-4 space-y-3">`;
                    trabajosOfWeek.forEach(t => {
                        trabajosHTML += `
                         <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/10 flex items-center justify-between group hover:border-primary/30 transition-all hover:translate-x-1 duration-300">
                            <div class="flex items-center gap-3 overflow-hidden w-full">
                                <span class="material-symbols-outlined text-error" data-icon="picture_as_pdf">picture_as_pdf</span>
                                <div class="truncate flex-1">
                                    <p class="text-xs font-bold text-on-surface truncate">${t.titulo || 'Trabajo'}</p>
                                    <p class="text-[10px] text-on-surface-variant truncate">${t.descripcion || 'Sin descripción'}</p>
                                    ${t.pdf_url ? `<a href="${t.pdf_url}" target="_blank" class="text-[10px] font-bold text-primary hover:underline block truncate mt-1 transition-colors">📄 Abrir archivo</a>` : ""}
                                </div>
                            </div>
                         </div>`;
                    });
                    trabajosHTML += `</div>`;
                }

                weeksHTML += `
                 <div class="space-y-4 pt-2">
                    <div class="flex items-center gap-4 relative transition-transform hover:-translate-y-0.5 duration-300">
                        <div class="absolute -left-[33px] top-1/2 w-8 h-[2px] bg-outline-variant/20"></div>
                        <div class="bg-white/80 backdrop-blur p-3 rounded-lg shadow-sm border border-outline-variant/10 flex items-center gap-3 w-fit min-w-[240px]">
                            <div class="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-secondary">
                                <span class="material-symbols-outlined" data-icon="calendar_today" style="font-size: 18px">calendar_today</span>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-on-surface">${w.titulo}</p>
                                <p class="text-[9px] font-bold text-secondary uppercase">${w.descripcion || 'Semana'}</p>
                            </div>
                        </div>
                    </div>
                    ${trabajosHTML}
                 </div>`;
            });

            unitNode.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-primary flex items-center gap-4 w-fit min-w-[280px]">
                    <div class="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined" data-icon="folder_open">folder_open</span>
                    </div>
                    <div>
                        <p class="font-headline font-bold text-on-surface">${u.nombre}</p>
                    </div>
                </div>
            </div>
            <div class="ml-16 space-y-2 border-l-2 border-outline-variant/20 pl-8 mt-4 pb-4">
                ${weeksHTML || '<p class="text-[10px] text-outline italic">Vacío</p>'}
            </div>
            `;
            treeContainer.appendChild(unitNode);
        });
    }

    // 4. Inserción: Crear Unidad
    if (btnCrearUnidad && nombreUnidadInput) {
        btnCrearUnidad.addEventListener("click", async (e) => {
            e.preventDefault();

            const numVal = nombreUnidadInput.value.trim();
            const numUnidad = parseInt(numVal, 10);

            // Validar que sea un número válido y mayor a 0
            if (!numVal || isNaN(numUnidad) || numUnidad <= 0) {
                alert("Por favor, ingresa un número de unidad válido (ej: 1, 2, 3...)");
                return;
            }

            const nombreGenerado = `Unidad ${numUnidad}`;
            console.log("Verificando existencia de:", nombreGenerado);

            // Verificar en Supabase si ya existe
            const { data: existeData, error: existeError } = await supabaseClient
                .from("unidades")
                .select("id")
                .eq("nombre", nombreGenerado);

            if (existeError) {
                console.log("ERROR VALIDANDO:", existeError);
                alert("Error al verificar duplicados: " + existeError.message);
                return;
            }

            // Si existe, lanzar alerta y detener el proceso
            if (existeData && existeData.length > 0) {
                alert(`Error: La ${nombreGenerado} ya existe en el sistema.`);
                return;
            }

            console.log("Creando:", nombreGenerado);

            // Guardar en base de datos si no existe
            const { data, error } = await supabaseClient
                .from("unidades")
                .insert([{ nombre: nombreGenerado }])
                .select();

            if (error) {
                console.log("ERROR INSERTANDO:", error);
                alert("Error: " + error.message);
            } else {
                console.log("RESPUESTA:", data);
                alert(`${nombreGenerado} creada correctamente 🚀`);
                nombreUnidadInput.value = "";
                fetchData();
            }
        });
    }

    // Función para subir archivos a Supabase Storage
    async function subirArchivo(file) {
        const safeName = file.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
            .replace(/\s+/g, "_")            // Reemplazar espacios por _
            .replace(/[^a-zA-Z0-9.\-_]/g, ""); // Eliminar caracteres especiales

        const fileName = Date.now() + "_" + safeName;

        const { data, error } = await supabaseClient.storage
            .from("docs")
            .upload(fileName, file);

        if (error) {
            console.error("Error al subir archivo:", error);
            return null;
        }

        const { data: publicUrlData } = supabaseClient.storage
            .from("docs")
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }

    // 5. Inserción: Agregar Semana a una Unidad (SÓLO DATOS)
    btnCreateWeek.addEventListener("click", async () => {
        const unidad_id = weekUnitSelect.value;
        const titulo = weekTitleInput.value.trim();
        const descInput = document.getElementById("week-desc-input-create");
        const descripcion = descInput && descInput.value.trim() ? descInput.value.trim() : "Trabajo";

        if (!unidad_id || !titulo) return alert("Debes seleccionar una unidad y rellenar el título de la semana.");

        btnCreateWeek.disabled = true;

        const payload = {
            unidad_id: parseInt(unidad_id),
            titulo: titulo,
            descripcion: descripcion
        };

        const { data, error } = await supabaseClient.from('semanas').insert([payload]);
        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Semana creada correctamente.");
            weekTitleInput.value = "";
            if (descInput) descInput.value = "";
            fetchData();
        }

        btnCreateWeek.disabled = false;
    });

    // 6. Actualización: Configurar Trabajo (SÓLO ARCHIVOS y DETALLES EXTRAS)
    btnUploadWork.addEventListener("click", async () => {
        const semana_id = workWeekSelect.value;
        const desc = workDescInput.value.trim();

        if (!semana_id) return alert("Selecciona una semana antes de subir el trabajo.");

        // OBLIGAR SUBIDA DE ARCHIVO REAL
        if (!workFileInput.files || workFileInput.files.length === 0) {
            alert("Error: Debes seleccionar un archivo PDF o DOCX para adjuntar.");
            return;
        }

        btnUploadWork.disabled = true;
        btnUploadWork.textContent = "Subiendo archivo...";

        let pdf_url = null;

        // SUBIDA CORRECTA A SUPABASE STORAGE
        const uploadedUrl = await subirArchivo(workFileInput.files[0]);
        if (uploadedUrl) {
            pdf_url = uploadedUrl;
        } else {
            alert("Error crítico: Hubo un problema al subir el archivo a Storage.");
            btnUploadWork.disabled = false;
            btnUploadWork.textContent = "Subir Trabajo";
            return; // Detener ejecución si la subida falla
        }

        const titulo = workTitleInput.value.trim() || 'Trabajo Adjunto';
        const payload = {
            semana_id: parseInt(semana_id),
            titulo: titulo,
            descripcion: desc || 'Sin descripción'
        };
        if (pdf_url) payload.pdf_url = pdf_url;

        const { data, error } = await supabaseClient.from('trabajos').insert([payload]);

        if (error) {
            alert("Error al actualizar la base de datos: " + error.message);
        } else {
            alert("Trabajo subido exitosamente.");
            workTitleInput.value = ""; // Limpia si hubiera algo
            workDescInput.value = "";
            workFileInput.value = "";
            fetchData();
        }

        btnUploadWork.disabled = false;
        btnUploadWork.textContent = "Subir Trabajo";
    });

    // 7. Cerrar Sesión
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", async (e) => {
            e.preventDefault();
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                console.error("Error cerrando sesión:", error);
                alert("Hubo un error al intentar cerrar la sesión.");
            } else {
                window.location.href = "index.html";
            }
        });
    }

    // Llamada de arranque
    fetchData();
});
